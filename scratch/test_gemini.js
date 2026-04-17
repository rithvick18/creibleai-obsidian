
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const apiKey = process.env.VITE_GEMINI_API_KEY;

async function test() {
  if (!apiKey) {
    console.error("API key missing");
    return;
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    console.log("Attempting to generate content with gemini-2.5-flash...");
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Hello",
    });
    console.log("Success:", response.text);
  } catch (error) {
    console.error("Error caught:", error);
  }
}

test();
