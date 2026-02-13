/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--bg-deep)",
                primary: "var(--primary)",
                secondary: "var(--secondary)",
            },
            fontFamily: {
                sans: "var(--font-display)",
            }
        },
    },
    plugins: [],
}
