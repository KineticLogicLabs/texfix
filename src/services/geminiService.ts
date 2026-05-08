import { GoogleGenAI, Type } from "@google/genai";

const getApiKey = () => {
  // Check process.env (injected via define)
  let key = process.env.GEMINI_API_KEY;
  
  if (!key || key === "undefined" || key === "MY_GEMINI_API_KEY") {
    return null;
  }
  return key;
};

const apiKey = getApiKey();
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export interface LatexFixResponse {
  fixedCode: string;
  explanation: string;
  errors: string[];
}

export async function fixLatexCode(brokenCode: string): Promise<LatexFixResponse> {
  if (!ai) {
    throw new Error("Gemini API key is not configured. Please check your GitHub Secrets or environment variables.");
  }
  const prompt = `You are an expert LaTeX typesetter.
Analyze the following potentially broken LaTeX code.
If there are errors, identify them and provide the corrected version.
If the code is purely mathematical, assume it might need delimiters like $ or $$ if they are missing, but prioritize fixing actual syntax errors.

Input Broken LaTeX:
${brokenCode}

Respond strictly in JSON format.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          fixedCode: {
            type: Type.STRING,
            description: "The corrected and properly formatted LaTeX code.",
          },
          explanation: {
            type: Type.STRING,
            description: "A brief explanation of what was fixed.",
          },
          errors: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of specific errors found.",
          },
        },
        required: ["fixedCode", "explanation", "errors"],
      },
    },
  });

  try {
    const result = JSON.parse(response.text || "{}");
    return result as LatexFixResponse;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    return {
      fixedCode: brokenCode,
      explanation: "Failed to parse AI response. The code might be too complex or the AI reached a limit.",
      errors: ["Parsing error"],
    };
  }
}
