import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, RecommendationResponse } from "../types";

const initializeGenAI = () => {
  
  const apiKey = process.env.API_KEY || ''; // In a real app, ensure this is set.
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

export const getRecommendations = async (user: UserProfile): Promise<RecommendationResponse> => {
  try {
    const ai = initializeGenAI();

    // Define the schema for structured JSON output
    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        recommendedProducts: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "List of 3-5 specific product names recommended for this user.",
        },
        reasoning: {
          type: Type.STRING,
          description: "A detailed explanation of why these products fit the user's demographic and behavior.",
        },
        marketingSubjectLine: {
          type: Type.STRING,
          description: "A catchy email subject line targeted at this user to drive conversion.",
        },
        churnRisk: {
          type: Type.STRING,
          enum: ["Low", "Medium", "High"],
          description: "Estimated risk of the user stopping engagement based on login and purchase frequency.",
        },
      },
      required: ["recommendedProducts", "reasoning", "marketingSubjectLine", "churnRisk"],
    };

    const prompt = `
      Act as a senior ecommerce data analyst and personalization engine.
      Analyze the following user profile and provide personalized product recommendations.

      User Profile:
      - Age: ${user.age}
      - Gender: ${user.gender}
      - Location: ${user.location}
      - Income: ₹${user.income}
      - Interests: ${user.interests}
      - Last Login: ${user.lastLoginDaysAgo} days ago
      - Average Order Value: ₹${user.averageOrderValue}
      - Total Spending: ₹${user.totalSpending}
      - Favorite Category: ${user.productCategoryPreference}
      
      Based on this data, suggest specific products, explain your reasoning, suggest a marketing email subject line, and estimate churn risk.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as RecommendationResponse;
    } else {
      throw new Error("No response text from Gemini");
    }
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    // Return fallback data if API fails or key is missing
    return {
      recommendedProducts: ["Generic Top Seller A", "Generic Top Seller B", "Gift Card"],
      reasoning: "Unable to connect to AI engine. Showing default best-sellers. Please check your API configuration.",
      marketingSubjectLine: "Discover our latest collection!",
      churnRisk: "Low"
    };
  }
};