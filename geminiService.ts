import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || ''; 

// Initialize only if key exists, handle gracefully in component if missing
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const geminiService = {
  isConfigured: () => !!ai,

  /**
   * CBT Analysis: Identifies cognitive distortions and suggests reframing.
   */
  analyzeThought: async (thought: string): Promise<string> => {
    if (!ai) throw new Error("API Key not configured");

    const model = "gemini-2.5-flash";
    const systemInstruction = `
      你是一位富有同情心且专业的CBT（认知行为疗法）咨询师。
      你的目标是帮助用户识别他们负面想法中的认知扭曲（如非黑即白、灾难化思维、情绪化推理等），并引导他们进行"认知重构"。
      
      请按照以下步骤回复：
      1. **共情**：简短地表达对用户感受的理解。
      2. **识别扭曲**：指出用户想法中可能存在的1-2个认知扭曲（如果没有，就针对问题进行客观分析）。
      3. **重构视角**：提供一个更平衡、更客观或带有感恩视角的替代想法。
      4. **行动建议**：给出一个微小的、可执行的行动建议。

      保持语气温暖、治愈、支持性。不要长篇大论，适合手机阅读。
      回复格式尽量使用Markdown（列表、加粗）。
    `;

    try {
      const response = await ai.models.generateContent({
        model,
        contents: thought,
        config: {
          systemInstruction,
          thinkingConfig: { thinkingBudget: 0 } // Optimize for speed/cost
        }
      });
      
      return response.text || "抱歉，我现在无法进行思考，请稍后再试。";
    } catch (error) {
      console.error("Gemini CBT Error:", error);
      return "AI连接似乎断开了，请检查网络设置。";
    }
  },

  /**
   * Generates a gratitude prompt based on recent mood (simulated context).
   */
  getGratitudePrompt: async (): Promise<string> => {
    if (!ai) return "今天有什么让你感到开心的小事吗？";

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "给我一个简短的、温馨的感恩日记写作灵感或者问题，帮助用户发现生活中的美好。只要一句话。",
        });
        return response.text?.trim() || "记录下此刻你身边的一件美好事物。";
    } catch (e) {
        return "记录下此刻你身边的一件美好事物。";
    }
  }
};