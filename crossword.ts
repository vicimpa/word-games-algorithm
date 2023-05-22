import { wordsArray3 } from "./data";
import data from "./data.json";
import { ColisionMap } from "./lib/ColisionMap";
import { makeCrossword } from "./lib/makeCrossword";
import { renderConsole } from "./lib/renderConsole";

const wordsArray = Object.entries(data).map(([word, question]) => ({
  word,
  meta: { question }
}));


const words = makeCrossword(wordsArray, {
  randomPosition: true,
  randomChars: true,
  randomCheck: true,
});

const collizion = ColisionMap.make(words);
renderConsole(collizion);