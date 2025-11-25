import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateDishDescription = async (dishName: string, category: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      Escreva uma descrição apetitosa e vendedora para um prato de restaurante.
      Nome do prato: ${dishName}
      Categoria: ${category}
      
      A descrição deve ter no máximo 25 palavras.
      Use português de Angola ou Portugal.
      Foque no sabor e frescura.
      Não use aspas na resposta.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error generating description:", error);
    return "Descrição indisponível no momento.";
  }
};