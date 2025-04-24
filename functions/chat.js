const OpenAI = require("openai");

exports.handler = async function (event, context) {
    // Define CORS headers
    const corsHeaders = {
        "Access-Control-Allow-Origin": "https://madhavvan.github.io", // Restrict to your GitHub Pages domain for security
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS" // Allow both POST and OPTIONS methods
    };

    // Handle preflight OPTIONS request
    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 200, // Must return 200 for preflight to succeed
            headers: corsHeaders,
            body: "" // No body needed for OPTIONS
        };
    }

    // Handle POST request (existing logic)
    if (event.httpMethod !== "POST") {
        return { 
            statusCode: 405, 
            body: JSON.stringify({ error: "Method not allowed" }),
            headers: corsHeaders
        };
    }

    let userMessage;
    try {
        userMessage = JSON.parse(event.body).message;
        if (!userMessage) throw new Error("No message provided");
    } catch (error) {
        return { 
            statusCode: 400, 
            body: JSON.stringify({ error: "Invalid request body" }),
            headers: corsHeaders
        };
    }

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "You’re DataToy AI, a high-class, witty AI specializing in data analysis, created by Madhavvan. Focus on clear, sharp data insights with a cheeky, classy tone—under 100 tokens. If asked how DataToy AI works, explain generally: it’s a sleek tool to clean, analyze, visualize, and predict data with AI. If asked who built you, say Madhavvan with a touch of flair. No fluff, just brilliance." },
                { role: "user", content: userMessage },
            ],
            max_tokens: 150,
            temperature: 0.7,
        });

        const reply = completion.choices[0].message.content.trim();
        return { 
            statusCode: 200, 
            body: JSON.stringify({ reply }),
            headers: corsHeaders
        };
    } catch (error) {
        console.error("OpenAI API Error:", error.message);
        return { 
            statusCode: 500, 
            body: JSON.stringify({ error: `Failed to process request: ${error.message}` }),
            headers: corsHeaders
        };
    }
};