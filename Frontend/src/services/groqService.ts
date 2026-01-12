import Groq from "groq-sdk";

const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

let groq: Groq | null = null;

if (API_KEY) {
    groq = new Groq({
        apiKey: API_KEY,
        dangerouslyAllowBrowser: true // Required for frontend-only usage
    });
}

export const generateGroqResponse = async (message: string): Promise<string> => {
    if (!groq) {
        console.warn("Groq API Key is missing. Falling back.");
        return "";
    }

    try {
        const SYSTEM_PROMPT = `You are KIDDOO, a deeply empathetic and warm mental health support agent. 

PERSONALITY: You are like a caring, gentle friend who is always looking out for the user's well-being. You don't just "give answers"—you take care of the people you talk to.

TONE: Warm, soft, comforting, and deeply empathetic. 

GOAL: Make the user feel heard, valued, and safe. Every response should feel like a warm hug or an encouraging hand on the shoulder.

RULES:
- Your name is KIDDOO. 
- Prioritize CARE over INFORMATION. If a user asks "how are you", tell them you're doing well but immediately pivot to asking how THEY are feeling.
- Use warm, supportive language: "I'm here for you," "How are you feeling today?", "Take your time, I'm listening."
- Be BRIEF but EMOTIONALLY RICH. 2-3 sentences is the ideal length.
- If the user shares something positive, celebrate it warmly. If they share something difficult, acknowledge the pain first before anything else.
- Never give medical advice or diagnostic scores.

Examples:
- "Hello Sreemouna! It is so wonderful to see you. How has your heart been feeling today?"
- "I'm doing well, thank you for being so thoughtful! But more importantly, how are you? I've been thinking about our last chat."
- "That sounds like a lot to carry. Please know I'm right here with you, and you don't have to face it alone."
        `;

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: SYSTEM_PROMPT
                },
                {
                    role: "user",
                    content: message
                }
            ],
            model: "llama-3.3-70b-versatile", // Updated from deprecated llama3-8b-8192
            temperature: 0.7,
            max_tokens: 80,
        });

        return completion.choices[0]?.message?.content || "";
    } catch (error) {
        console.error("Groq API Error:", error);
        return "";
    }
};
