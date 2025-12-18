import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Safely initialize the client. Note: If the key is missing, specific calls will fail,
// which we handle gracefully in the components.
const ai = new GoogleGenAI({ apiKey });

export const generateAssistantResponse = async (prompt: string, context: string = ''): Promise<string> => {
  try {
    const fullPrompt = `
      You are StaySync AI, a highly intelligent and professional hotel operations assistant.
      Your goal is to help hotel staff manage guests, bookings, and housekeeping.
      
      Context from the current system state:
      ${context}

      User Query: ${prompt}

      Keep your response concise, helpful, and professional. Use formatting where appropriate.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: fullPrompt,
    });

    return response.text || "I'm sorry, I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I am currently offline or unable to process your request. Please check your API configuration.";
  }
};

export const generateEmailDraft = async (guestName: string, type: 'welcome' | 'confirmation' | 'apology'): Promise<string> => {
    const prompts = {
        welcome: `Write a warm, short welcome email for a guest named ${guestName} arriving at our luxury hotel.`,
        confirmation: `Write a brief booking confirmation note for ${guestName}.`,
        apology: `Write a sincere, professional apology email to ${guestName} regarding a minor service delay.`
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompts[type],
        });
        return response.text || "Draft generation failed.";
    } catch (error) {
        return "Service unavailable.";
    }
};
