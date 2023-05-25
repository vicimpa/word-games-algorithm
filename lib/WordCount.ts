import { TWord } from "./Word";

export class WordCount {
  #words = new Map<string, number>();

  append<T>(word: TWord<T>) {
    word = typeof word === 'string' ? word : word.word;
    const count = (this.#words.get(word) ?? 0) + 1;
    this.#words.set(word, count);
    return count;
  }

  reset<T>(word: TWord<T>) {
    word = typeof word === 'string' ? word : word.word;
    this.#words.set(word, 0);
    return 0;
  }

  getMaxCount() {
    let find: { word: string, count: number; } | undefined;

    for (const [word, count] of this.#words) {
      if (!find || find.count < count)
        find = { word, count };
    }

    return find;
  }
}