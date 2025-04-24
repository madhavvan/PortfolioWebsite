const OpenAI = require("openai");

exports.handler = async function (event, context) {
    // Add CORS headers to all responses
    const corsHeaders = {
        "Access-Control-Allow-Origin": "*", // Allows requests from any origin (you can restrict to "https://madhavvan.github.io" if needed)
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST"
    };

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
                { role: "system", content: "You are a helpful AI assistant specializing in data analysis. Provide concise and accurate responses." },
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