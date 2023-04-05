const express = require("express");
const { isAuthenticated } = require("../middleware/auth.js");
const { Configuration, OpenAIApi } = require("openai");

const aiRouter = express.Router();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

aiRouter.get(
  "/generate/chord/:chordtype/:note",
  isAuthenticated,
  async (req, res) => {
    if (!configuration.apiKey) {
      return res.status(500).json({ error: "OpenAI API Key not found" });
    }
    const prompt = req.params.note;
    if (!prompt || !prompt.length) {
      return res.status(422).json({ error: "Prompt is required" });
    }

    const chordType = req.params.chordtype;
    if (
      !chordType ||
      !chordType.length ||
      (chordType !== "major" && chordType !== "minor")
    ) {
      return res.status(422).json({ error: "Chord type is required" });
    }

    try {
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful musical assistant" },
          {
            role: "user",
            content: `What notes make up the ${prompt} ${chordType} chord?`,
          },
        ],
        temperature: 0,
      });
      return res
        .status(200)
        .json({ result: completion.data.choices[0].message.content });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
);

aiRouter.get(
  "/generate/progression/:progressiontype",
  isAuthenticated,
  async (req, res) => {
    if (!configuration.apiKey) {
      return res.status(500).json({ error: "OpenAI API Key not found" });
    }

    const type = req.params.progressiontype;
    if (!type || !type.length || (type !== "chord" && type !== "rhythm")) {
      return res.status(422).json({ error: "Progression type is required" });
    }

    try {
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful musical assistant" },
          {
            role: "user",
            content: `Suggest a ${type} progression`,
          },
        ],
        temperature: 1,
      });
      return res
        .status(200)
        .json({ result: completion.data.choices[0].message.content });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
);

module.exports = { aiRouter };
