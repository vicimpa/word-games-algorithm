import { wordsArray3 } from "./data";
import { ColisionMap } from "./lib/ColisionMap";
import { makeCrossword } from "./lib/makeCrossword";
import { renderConsole } from "./lib/renderConsole";


const words = makeCrossword(wordsArray3, {
  randomPosition: true,
  randomChars: true,
  randomCheck: true,
});

const collizion = ColisionMap.make(words);
renderConsole(collizion);