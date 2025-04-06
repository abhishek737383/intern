// server/config/openai.js
import pkg from 'openai';
const { OpenAI } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getChatResponse(question) {
  try {
    const response = await openai.chat.completions.create({
      messages: [{ role: "user", content: question }],
      model: "gpt-3.5-turbo",
    });
    // Return the assistant's reply from the first choice
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return "Error fetching response from AI.";
  }
}
