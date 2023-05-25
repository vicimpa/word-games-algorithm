import { ColisionMap } from "./ColisionMap";
import { oneOf, randomArray } from "./utils";
import { vectorGenerator } from "./vectorGenerator";
import { Word, WordType } from "./Word";
import { WordCount } from "./WordCount";

export enum Difficulty {
  EASY,
  MEDIUM,
  HARD
}

export enum Margin {
  NONE,
  PLUS,
  CIRCLE
}

export interface IOptions {
  /** @description Ширина (15) */
  width?: number;

  /** @description Высота (15) */
  height?: number;

  /** @description Сложность (Difficulty.HARD) */
  difficulty?: Difficulty;

  /** @description Отступы (Margin.NONE) */
  margin?: Margin;

  /** @description Количество попыток (1000) */
  tryAttempts?: number;
}

const DOPS: [x: number, y: number][] = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
  [-1, -1],
  [1, -1],
  [-1, 1],
  [1, 1]
];

export function makeWordSearch<T extends object>(
  words: string[],
  {
    width = 15,
    height = 15,
    difficulty = Difficulty.HARD,
    tryAttempts = 1000,
    margin = Margin.NONE,
  } = {} as IOptions
) {
  const counts = new WordCount();
  const dops = DOPS.slice(0, 1 + (margin * 4));
  let attempts = tryAttempts;
  while (true) {

    try {
      const objectWords: Word<T>[] = [];
      const collizion = ColisionMap.make(objectWords);

      let variants = [
        WordType.HORIZONTAL,
        WordType.VERTICAL,
        WordType.LEFT,
        WordType.RIGHT
      ].slice(0, 1 << difficulty);

      words = [...words].sort(() => Math.random() > .5 ? 1 : -1);

      for (const word of words) {
        variants = randomArray(variants);

        const newWord = new Word(word, oneOf(...variants));

        if (newWord.width > width || newWord.height > height)
          throw new Error('Oversize word in table');

        const positions = [...vectorGenerator({
          ...newWord,
          width: width - newWord.width,
          height: height - newWord.height
        })].filter(([x, y]) => {
          newWord.x = x;
          newWord.y = y;

          return !collizion.check(newWord, dops);
        });

        if (!positions.length) {
          counts.append(word);
          throw new Error(`Can not insert word ${counts.getMaxCount()?.word}`);
        }

        const position = randomArray(positions)[0];
        newWord.x = position[0];
        newWord.y = position[1];
        objectWords.push(newWord);
        collizion.append(newWord);
      }

      return objectWords;
    } catch (e) {
      if (--attempts > 0)
        continue;

      throw e;
    }
  }
}