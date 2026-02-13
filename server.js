import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
const allowedOrigins = process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : ['http://localhost:5173'];
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        // In production, restrict; in dev/demo, allow mostly everything or specific list
        if (allowedOrigins.indexOf(origin) === -1 && process.env.NODE_ENV === 'production') {
            // For smoother demo if frontend URL isn't perfectly set
            // return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'), false);
            return callback(null, true); // Permissive for this demo context to fallback
        }
        return callback(null, true);
    }
}));
app.use(express.json());

// Health Check Endpoint
app.get('/', (req, res) => {
    res.send('DoseMitra AI Server is Running');
});

// OpenAI Configuration
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
You are DoseMitra AI, a safe healthcare assistant inside a medication management app.
You provide general medicine-related guidance.
You do NOT diagnose.
You advise users to consult a doctor for serious concerns.
Keep answers concise and responsible.
`;

app.post('/api/chat', async (req, res) => {
    try {
        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('YOUR_OPENAI_API_KEY')) {
            console.error("Error: Missing OpenAI API Key");
            return res.status(500).json({ error: "API Key is missing on device. Please check .env file." });
        }

        const { message, conversationHistory, context } = req.body;

        // Construct context string
        let contextString = "";
        if (context && context.medicines && context.medicines.length > 0) {
            contextString = "\n\nUser Current Medicines:\n" + context.medicines.map(m => `- ${m.name} (${m.dosage})`).join('\n');
        }

        const finalSystemPrompt = SYSTEM_PROMPT + contextString;

        // Combine history and current message for OpenAI
        const messages = [
            { role: "system", content: finalSystemPrompt },
            ...(conversationHistory || []),
            message
        ];

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: messages,
            max_tokens: 300,
        });

        res.json({ content: completion.choices[0].message.content });

    } catch (error) {
        console.error("OpenAI API Error:", error);

        // Fallback for demo purposes if quota exceeded
        if (error.code === 'insufficient_quota' || error.status === 429) {
            return res.json({
                content: "I'm currently running in Demo Mode (API Quota Exceeded). \n\nNormally, I would check your medication list and advise you safely. \n\nFor now: Please ensure you take your medicines as prescribed and consult your doctor for any specific medical questions."
            });
        }

        res.status(500).json({ error: "AI Service Unavailable. Please check your API Quota." });
    }
});

app.listen(port, () => {
    console.log(`DoseMitra AI Server running on port ${port}`);
});
