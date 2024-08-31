import { ChatOpenAI } from "@langchain/openai";
import { DallEAPIWrapper } from "@langchain/openai";

export const llm = new ChatOpenAI({
  model: "gpt-4",
});

export const imageGenerationModel = new DallEAPIWrapper({
  n: 1, // Default
  model: "dall-e-2", // Default
  size: "256x256",
  quality: "standard",
});
