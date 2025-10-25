import { GoogleGenAI } from "@google/genai";
import { HelpType, Problem, ProblemType } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const getBasePrompt = (problem: Problem) => {
  let problemDescription = '';
  if (problem.type === ProblemType.EXPRESSION) {
    problemDescription = `The math expression is: ${problem.question.replace(' = ?', '')}. The goal is to find the single number value. Remember the order of operations (PEMDAS/BODMAS)!`;
  } else { // EQUATION
    problemDescription = `The equation is: ${problem.question}. The goal is to find the value of 'x' that makes the equation true. Think of it like finding a secret number to balance both sides.`;
  }
  return `You are a helpful and cool tutor for a 13-year-old 7th grader who struggles with inattentive ADHD. Your explanations must be clear, concise, and relatable for a teenager. Use analogies from video games (like leveling up or finding a secret code), technology, or sports. Keep it chill and avoid being patronizing or overly simplistic. Break down concepts into simple, manageable steps. ${problemDescription}.`;
};

const getHelpPrompt = (type: HelpType, problem: Problem) => {
  const basePrompt = getBasePrompt(problem);
  switch (type) {
    case HelpType.EXPLAIN:
      return `${basePrompt} Explain what this problem is asking. For equations, explain the concept of isolating the variable 'x'. For expressions, explain the order of operations needed.`;
    case HelpType.HINT:
      return `${basePrompt} Give a single, direct hint to get started. For an equation, what's the first step to get 'x' by itself? For an expression, what's the first operation to perform? Don't give away the answer.`;
    case HelpType.EXAMPLE:
      return `${basePrompt} Show a similar but different problem and walk through the solution step-by-step. Make the explanation very clear.`;
    default:
      return '';
  }
};

export const getAIHelp = async (type: HelpType, problem: Problem): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API key is not configured. Please contact support.";
  }
  
  const prompt = getHelpPrompt(type, problem);
  if (!prompt) {
    return "Sorry, I can't provide help for this type of request.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching AI help:", error);
    return "Oops! I had a little trouble thinking of a hint. Please try again.";
  }
};
