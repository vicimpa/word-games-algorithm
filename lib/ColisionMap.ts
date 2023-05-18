import { Word } from "./Word";

const SPLIT_KEY = ';';

export class ColisionMap {
  #map = new Map<string, string>;

  #key(x: number, y: number) {
    return [x, y].join(SPLIT_KEY);
  }

  has(x: number, y: number) {
    return this.#map.has(this.#key(x, y));
  }

  get(x: number, y: number) {
    return this.#map.get(this.#key(x, y));
  }

  set(x: number, y: number, v: string) {
    return this.#map.set(this.#key(x, y), v);
  }

  clear() {
    return this.#map.clear();
  }

  check(
    word: Word,
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

  append(word: Word) {
    for (const [x, y, c] of word.vectors())
      this.set(x, y, c);
  }

  matrix() {
    let
      minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;

    for (const [[x, y]] of this.entries()) {
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }

    const width = maxX - minX;
    const height = maxY - minY;

    const output: string[][] = Array.from(
      { length: height },
      () => Array.from(
        { length: width }
      )
    );

    let deltaX = minX < 0 ? Math.abs(minX) : 0;
    let deltaY = minY < 0 ? Math.abs(minY) : 0;

    for (let y = minY; y <= maxY; y++) {
      const row = output[y + deltaY] ?? (
        output[y + deltaY] = []
      );

      for (let x = minX; x <= maxX; x++) {
        row[x + deltaX] = this.get(x, y)!;
      }
    }

    return output;
  }

  *entries() {
    for (const [key, value] of this.#map) {
      const [x, y] = key.split(SPLIT_KEY).map(Number);
      yield [[x, y], value] as [
        vec: [x: number, y: number],
        value: string
      ];
    }
  }

  static make(words: Word[], output = new this()) {
    for (const word of words)
      output.append(word);

    return output;
  }
}