const { Configuration, OpenAIApi } = require("openai");

  module.exports = async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    try {
      const apiKey = process.env.OPENAI_API_KEY;
      console.log("API Key exists:", !!apiKey); // Log if the key exists
      if (!apiKey) {
        return res.status(500).json({ error: "Missing API key: OPENAI_API_KEY not set in environment variables" });
      }

      const configuration = new Configuration({
        apiKey: apiKey,
      });
      const openai = new OpenAIApi(configuration);

      const { message } = req.body;
      console.log("Received message:", message); // Log the incoming message

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful AI assistant specializing in data analysis." },
          { role: "user", content: message },
        ],
      });

      console.log("OpenAI API response:", response.data); // Log the API response

      if (!response.data || !response.data.choices || !response.data.choices[0]) {
        return res.status(500).json({ error: "Invalid response from OpenAI API" });
      }

      res.status(200).json({
        reply: response.data.choices[0].message.content,
      });
    } catch (error) {
      console.error("Error in API call:", error.message, error.stack);
      console.error("Error response details:", error.response ? error.response.data : "No response data");
      res.status(500).json({ 
        error: "Failed to process request", 
        details: error.message,
        status: error.response ? error.response.status : null,
        data: error.response ? error.response.data : null
      });
    }
  };