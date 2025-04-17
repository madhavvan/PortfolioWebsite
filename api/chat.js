const { Configuration, OpenAIApi } = require("openai");

module.exports = async (req, res) => {
  try {
    const configuration = new Configuration({
      apiKey: process.env.XAI_API_KEY,
      basePath: "https://api.x.ai/v1",
    });
    const openai = new OpenAIApi(configuration);

    const { message } = req.body;

    const response = await openai.createChatCompletion({
      model: "grok-beta",
      messages: [{ role: "user", content: message }],
    });

    res.status(200).json({
      reply: response.data.choices[0].message.content,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};