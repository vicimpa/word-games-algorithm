import { ColisionMap } from "./ColisionMap";
import { oneOf, randomArray } from "./utils";
import { Word, WordType } from "./Word";

export interface IOptions {
  /** @description Положение первого слова (random()) */
  firstType?: WordType.HORIZONTAL | WordType.VERTICAL;

  /** @description Количество попыток (1000) */
  tryAttempts?: number;

  /** @description Сортировать рандомно входные данные (false) */
  randomPosition?: boolean;

  /** @description Сортировать рандомно слова для поиска (false) */
  randomCheck?: boolean;

  /** @description Сортировать порядок символов в поиске (false) */
  randomChars?: boolean;
}

const CHECK_RULE: [x: number, y: number][] = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0]
];

export function makeCrossword(
  words: string[],
  {
    firstType = oneOf(WordType.HORIZONTAL, WordType.VERTICAL),
    tryAttempts = 1000,
    randomPosition = false,
    randomCheck = false,
    randomChars = false
  } = {} as IOptions
) {
  let attempts = tryAttempts;
  while (true) {
    if (randomPosition) {
      words = randomArray(words);
    }
    try {
      const objectWords: Word[] = [];
      const collizion = ColisionMap.make(objectWords);

      for (const word of words) {
        const newWord = new Word(word, firstType);
        const forFind = randomCheck ? randomArray(objectWords) : objectWords;

        const find = forFind.find(w => {
          let chars = Object.entries([...newWord.word]);

          newWord.type = w.type ^ 1;

          if (randomChars)
            chars = randomArray(chars);

          for (const [k, c] of chars) {
            const i = +k;

            for (let j = 0; j < w.length; j++) {
              const char = w.word[j];
              const index = j;

              if (w.used.has(j))
                continue;

              if (c !== char)
                continue;

              newWord.x = w.x + (newWord.type ? index : -i);
              newWord.y = w.y + (newWord.type ? -i : index);

              const skip = [
                w.x + (newWord.type ? index : 0),
                w.y + (newWord.type ? 0 : index)
              ] as [number, number];

              if (collizion.check(newWord, CHECK_RULE, [skip]))
                continue;

              w.used.add(j);
              newWord.used.add(i);

              return true;
            }
          }
        });

        if (objectWords.length && !find) {
          throw new Error(`Can not make crossword with word "${word}"`);
        }

        objectWords.push(newWord);
        collizion.append(newWord);
      }

      return objectWords;
    } catch (e) {
      if ((randomPosition || randomCheck || randomChars) && --attempts > 0)
        continue;

      throw e;
    }
  }
}