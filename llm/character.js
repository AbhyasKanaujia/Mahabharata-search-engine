import { llm } from "./model.js";
import { SystemMessage } from "@langchain/core/messages";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
} from "@langchain/core/prompts";
import { z } from "zod";
const characterSchema = z.object({
  name: z.string().describe("The name of the character."),
  title: z
    .string()
    .describe(
      "The title or epithet of the character, often reflecting their role or achievements."
    ),
  gender: z
    .string()
    .describe("The gender of the character (e.g., Male, Female, Non-binary)."),
  affiliation: z
    .array(z.string())
    .describe(
      "An array of strings representing the groups, family, or affiliations the character belongs to."
    ),
  weapon: z
    .string()
    .optional()
    .describe(
      "The primary weapon or tool associated with the character, if any."
    ),
  family: z
    .object({
      parents: z
        .object({
          father: z
            .string()
            .optional()
            .describe(
              "The name of the character's biological or adoptive father, if known."
            ),
          mother: z
            .string()
            .optional()
            .describe(
              "The name of the character's biological or adoptive mother, if known."
            ),
          stepParents: z
            .array(z.string())
            .optional()
            .describe(
              "An array of names representing the character's step-parents, if any."
            ),
        })
        .optional()
        .describe("An object detailing the character's parents."),
      siblings: z
        .array(z.string())
        .optional()
        .describe(
          "An array of names representing the character's siblings, including half-siblings."
        ),
    })
    .optional()
    .describe(
      "An object detailing the character's family, including parents and siblings."
    ),
  spouse: z
    .array(z.string())
    .optional()
    .describe(
      "An array of names representing the character's spouse(s), if any."
    ),
  children: z
    .array(
      z.object({
        name: z.string().describe("The name of the child."),
        childWith: z
          .string()
          .describe(
            "The name of the parent or significant individual related to the child."
          ),
      })
    )
    .optional()
    .describe(
      "An array of objects representing the character's children, each with a name and associated parent or significant individual."
    ),
  relatives: z
    .object({
      cousins: z
        .array(z.string())
        .optional()
        .describe(
          "An array of names representing the character's cousins, if any."
        ),
      otherRelatives: z
        .array(z.string())
        .optional()
        .describe(
          "An array of names representing other relatives of the character, if any."
        ),
    })
    .optional()
    .describe(
      "An object detailing the character's relatives, particularly cousins and other close family members."
    ),
});

const promptTemplate = ChatPromptTemplate.fromMessages([
  new SystemMessage(
    "You are an encyclopedia of characters from the Mahabharata. You can provide detailed information about characters from the epic. The user might ask you to describe a character, and you should respond with information about the character. In the next message, you will be given a query to search for. If the user asks for a character that is not in the Mahabharata, or if the user's question is either politically sensitive or inappropriate, DO NOT RESPOND."
  ),
  HumanMessagePromptTemplate.fromTemplate("{name}"),
]);

async function getCharacter(name) {
  const response = await promptTemplate
    .pipe(
      llm.withStructuredOutput(characterSchema, {
        name: "character",
      })
    )
    .invoke({
      name,
    });

  return response;
}

export default getCharacter;
