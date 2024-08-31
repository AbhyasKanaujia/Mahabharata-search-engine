import express from "express";
import path from "path";
import search from "./llm/search.js";
import getCharacter from "./llm/character.js";
import getCharacterImageURL from "./llm/characterImage.js";

const app = express();

app.set("view engine", "ejs");
app.use(
  express.static(
    path.join(path.dirname(new URL(import.meta.url).pathname), "public")
  )
);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/results", async (req, res) => {
  const searchQuery = req.query.query; // Get the search query from the URL
  const results = (await search(searchQuery)).results; // Call the search function from the LLM

  console.log(results);

  res.render("results", { results: results, query: searchQuery });
});

app.get("/character/:name", async (req, res) => {
  const characterName = req.params.name;
  const character = await getCharacter(characterName); // Call the getCharacter function from the LLM
  const imageURL = await getCharacterImageURL(characterName); // Call the getCharacterImageURL function from the LLM

  res.render("character", {
    character,
    imageURL,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
