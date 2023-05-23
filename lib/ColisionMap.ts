import { VectorMap } from "./VectorMap";
import { Word } from "./Word";

export class ColisionMap extends VectorMap<string> {
  check<T extends Word<any>>(
    word: T,
    rule: [x: number, y: number][] = [],
    skips: [x: number, y: number][] = [],
    skipIdentity = false
  ) {
    rule = [[0, 0], ...rule];

    for (const [X, Y, char] of word.vectors()) {
      if (skipIdentity && this.get(X, Y) === char)
        skips.push([X, Y]);

      if (skips.find(([sX, sY]) => X === sX && Y === sY))
        continue;

      for (const [dX, dY] of rule) {
        const [x, y] = [X + dX, Y + dY];

        if (skips.find(([sX, sY]) => x === sX && y === sY))
          continue;

        if (this.get(x, y))
          return true;
      }
    }

    return false;
  }

  append<T extends Word<any>>(word: T) {
    for (const [x, y, c] of word.vectors())
      this.set(x, y, c);
  }

  static make<T extends object>(words: T[], output = new this()) {
    for (const word of words)
      output.append(word as any);

    return output;
  }
}