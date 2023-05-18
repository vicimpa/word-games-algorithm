import { wordsArray1, wordsArray2, wordsArray3 } from "./data";
import { ColisionMap } from "./lib/ColisionMap";
import { FgBlack, FgCyan, Reset } from "./lib/colors";
import { Difficulty, makeWordSearch, Margin } from "./lib/makeWordSearch";
import { renderConsole } from "./lib/renderConsole";
import { randomArray } from "./lib/utils";

const words = makeWordSearch(wordsArray3.slice(0, 10), {
  width: 15,
  height: 15,
  difficulty: Difficulty.MEDIUM,
  margin: Margin.PLUS
});
const collizion = ColisionMap.make(words);

renderConsole(collizion, {
  item: (e) => `${FgCyan}${e}${Reset}`,
  empty: () => `${FgBlack}${randomArray([...'bcdfghjklmnpqrstvwxz'])[0]}${Reset}`
}); 