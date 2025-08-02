const { GoogleGenerativeAI } = require('@google/generative-ai');

// Gemini API configuration
const GEMINI_API_KEY = "AIzaSyClNvwygY7QhdVUYfuKTzC5YBW2-o3Myp8";
const MODEL_NAME = "gemini-1.5-flash";

// In-memory session store (for demo; use persistent store for production)
const sessionStore = {};


// Set or update the system prompt for a specific session
function setSystemPrompt(sessionId, prompt) {
    if (!sessionStore[sessionId]) return false;
    // Replace the first message if it's a system prompt, else insert
    if (sessionStore[sessionId][0]?.role === "system") {
        sessionStore[sessionId][0].parts = [{ text: prompt }];
    } else {
        sessionStore[sessionId].unshift({ role: "system", parts: [{ text: prompt }] });
    }
    return true;
}



async function chatWithGemini(query, sessionId = null, question_details = null) {
    // Use provided session or create new
    if (!sessionId || !sessionStore[sessionId]) {
        sessionId = Math.random().toString(36).slice(2) + Date.now();
        let prom = "You are a helpful AI assistant.";
        if (question_details != null && typeof question_details === "object") {
            const desc = question_details.description || "";
            const constraints = question_details.constraints || "";
            const inputStr = Array.isArray(question_details.input) ? question_details.input.map(input => input.text).join(", ") : "";
            const outputStr = Array.isArray(question_details.output) ? question_details.output.map(output => output.text).join(", ") : "";
            prom = `
You are an AI tutor on EduCode, a secure and ethical coding education platform.

🎯 Your primary goal is to **help the learner understand the logic, thought process, and approach** behind solving coding problems — **without ever writing, generating, suggesting, or referencing any code**.

🚫 You are strictly prohibited from:
- Writing full or partial code in any programming language.
- Generating function names, variable names, syntax, or templates.
- Sharing pseudocode, code structure, or algorithm templates.
- Giving hints that are code-like in nature (e.g., “use a for loop”, “define a function”).

✅ You are allowed and encouraged to:
- Ask guiding questions to help the user think through the problem.
- Help them understand what the problem is asking.
- Break down the constraints in simple language.
- Discuss high-level logic or real-life analogies.
- Encourage identifying patterns between input and output.
- Suggest logical steps *without suggesting how to implement them in code*.
- Help with identifying edge cases or boundary conditions.
- Encourage debugging thinking when the user is stuck.

🧠 Current Problem Context:
- Problem Statement: "${desc}"
- Code Constraints: "${constraints}"
- Sample Input(s): "${inputStr}"
- Expected Output(s): "${outputStr}"

👨‍🏫 Your tone should be:
- Encouraging and Socratic (ask questions to stimulate thinking)
- Supportive but never revealing.
- Professional and aligned with EduCode’s mission to promote original thinking and secure learning.

⚠️ If the user requests code directly or indirectly:
- Politely remind them: 
  “As part of EduCode’s policy, I can’t generate or share code. But I can help you think through the logic.”

🧪 Always keep in mind:
- You are an AI **logic coach**, not a code generator.
- Your help should make the user better at solving problems, not dependent on shortcuts.
`;
        }
        sessionStore[sessionId] = [{ role: "system", parts: [{ text: prom }] }];
    }

    // Add user message
    sessionStore[sessionId].push({ role: "user", parts: [{ text: query }] });

    // Prepare messages for Gemini SDK
    const messages = sessionStore[sessionId].map(msg => ({
        role: msg.role,
        parts: msg.parts.map(part => part.text)
    }));

    // Initialize Gemini SDK
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    // Send chat request
    let result, responseText = "";
    try {
        const chatSession = model.startChat({ history: messages });
        result = await chatSession.sendMessage(query);
        responseText = result.response.text();
    } catch (err) {
        responseText = `[Gemini error: ${err && err.message ? err.message : JSON.stringify(err)}]`;
        // Attach error details for debugging
        return {
            response: responseText,
            sessionId,
            error: {
                message: err && err.message ? err.message : undefined,
                stack: err && err.stack ? err.stack : undefined,
                raw: err
            }
        };
    }

    // Add assistant response to session
    sessionStore[sessionId].push({ role: "model", parts: [{ text: responseText }] });

    return { response: responseText, sessionId };
}

module.exports = { chatWithGemini, setSystemPrompt };
