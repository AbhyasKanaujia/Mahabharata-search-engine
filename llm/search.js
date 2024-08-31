import { llm } from "./model.js";
import { SystemMessage } from "@langchain/core/messages";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
} from "@langchain/core/prompts";
import { z } from "zod";

const searchResultsSchema = z.object({
  // the result can be an array of strings or an empty array
  results: z
    .array(
      z
        .object({ name: z.string() })
        .describe("Name of character from Mahabharata")
    )
    .min(0),
});

const promptTemplate = ChatPromptTemplate.fromMessages([
  new SystemMessage(
    "You are a search engine for characters from the Mahabharata. You can search for characters by name. The user might ask you to find a character, and you should respond with the name of the characters that match the query. Eg. if the user asks for 'father of Arjun', you should respond with 'Pandu'. If user asks for 'who are the children of Kunti', you should respond with 'Yudhishthira, Bhima, Arjuna, Nakula, Sahadeva'. In the next message you will be given a query to search for. If the user asks for a character that is not in the Mahabharata, DO NOT RESPOND."
  ),
  HumanMessagePromptTemplate.fromTemplate("{query}"),
]);

async function search(query) {
  const response = await promptTemplate
    .pipe(
      llm.withStructuredOutput(searchResultsSchema, {
        name: "results",
      })
    )
    .invoke({
      query,
    });

  return response;
}

export default search;
