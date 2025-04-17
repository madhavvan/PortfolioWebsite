const { Configuration, OpenAIApi } = require("openai");

module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader("Access-Control-Allow-Origin", "https://madhavvan.github.io/PortfolioWebsite/");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Handle preflight OPTIONS request
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    try {
        // Log request details for debugging
        console.log("Received request:", req.method, req.body);

        // Validate request body
        const { message } = req.body || {};
        if (!message) {
            console.error("Request body missing 'message' field");
            return res.status(400).json({ error: "Message is required" });
        }

        // Check for XAI_API_KEY
        if (!process.env.XAI_API_KEY) {
            console.error("XAI_API_KEY is not set in environment variables");
            return res.status(500).json({ error: "Server configuration error: Missing XAI_API_KEY" });
        }

        // Initialize xAI API
        console.log("Initializing xAI API client...");
        const configuration = new Configuration({
            apiKey: process.env.XAI_API_KEY,
            basePath: "https://api.x.ai/v1",
        });
        const openai = new OpenAIApi(configuration);

        // Make API call
        console.log("Sending request to xAI API with message:", message);
        const response = await openai.createChatCompletion({
            model: "grok-beta",
            messages: [{ role: "user", content: message }],
        });

        // Log the response
        console.log("Received response from xAI API:", response.data);

        // Return response
        res.status(200).json({
            reply: response.data.choices[0].message.content,
        });
    } catch (error) {
        // Log the error for debugging
        console.error("Error in /api/chat:", error.message, error.stack);
        res.status(500).json({ error: `Server error: ${error.message}` });
    }
};