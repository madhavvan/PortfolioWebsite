const { Configuration, OpenAIApi } = require("openai");

module.exports = async (req, res) => {
  try {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const { message } = req.body;

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });

    res.status(200).json({
      reply: response.data.choices[0].message.content,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};