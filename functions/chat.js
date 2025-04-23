const OpenAI = require("openai");

exports.handler = async function (event, context) {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
    }

    let userMessage;
    try {
        userMessage = JSON.parse(event.body).message;
        if (!userMessage) throw new Error("No message provided");
    } catch (error) {
        return { statusCode: 400, body: JSON.stringify({ error: "Invalid request body" }) };
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
        return { statusCode: 200, body: JSON.stringify({ reply }) };
    } catch (error) {
        console.error("OpenAI API Error:", error.message);
        return { statusCode: 500, body: JSON.stringify({ error: `Failed to process request: ${error.message}` }) };
    }
};