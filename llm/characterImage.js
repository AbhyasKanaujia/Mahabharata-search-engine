import { imageGenerationModel } from "./model.js";

export default async function getCharacterImageURL(name) {
  const imageURL = await imageGenerationModel.invoke(
    `a painting of the character ${name} from Mahabharata`
  );
  return imageURL;
}
