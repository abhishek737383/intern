import axios from 'axios';

class ChatEngine {
  async processQuestion(question) {
    // Block any Java-related questions.
    if (/(java|jdk|jvm)/i.test(question)) {
      return "I will not answer Java questions.";
    }

    try {
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill',
        { inputs: question },
        {
          headers: { 
            Authorization: `Bearer ${process.env.HF_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Handle the Hugging Face API response:
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data[0].generated_text || "No generated text found.";
      } else if (response.data.generated_text) {
        return response.data.generated_text;
      } else {
        return "Sorry, I'm having trouble processing your request.";
      }
    } catch (error) {
      console.error('Chat engine error:', error.response?.data || error);
      return "Sorry, I'm having trouble answering that right now.";
    }
  }
}

export default new ChatEngine();
