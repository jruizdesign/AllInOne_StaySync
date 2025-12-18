import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

const getAiClient = () => {
    if (!aiClient) {
        // Fallback to a dummy key if process.env.API_KEY is not set to prevent constructor error.
        // Calls will fail gracefully in the try-catch blocks below.
        const apiKey = process.env.API_KEY || 'MISSING_KEY';
        aiClient = new GoogleGenAI({ apiKey });
    }
    return aiClient;
};

export const generateAssistantResponse = async (prompt: string, context: string = ''): Promise<string> => {
  try {
    const ai = getAiClient();
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
        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompts[type],
        });
        return response.text || "Draft generation failed.";
    } catch (error) {
        return "Service unavailable.";
    }
};