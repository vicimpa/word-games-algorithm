export enum WordType {
  HORIZONTAL,
  VERTICAL,
  LEFT,
  RIGHT,
}

export const WordDirection = {
  [WordType.HORIZONTAL]: [1, 0],
  [WordType.VERTICAL]: [0, 1],
  [WordType.LEFT]: [-1, 1],
  [WordType.RIGHT]: [1, 1]
};

export type TWord<T> = string | {
  word: string;
  meta?: T;
};

export class Word<T = never> {
  x = 0;
  y = 0;

  readonly word!: string;
  type!: WordType;
  readonly length!: number;
  readonly meta!: T;

  #used = new Set<number>();

  get used() { return this.#used; }

  get width() {
    switch (this.type) {
      case WordType.VERTICAL:
        return 1;

      case WordType.HORIZONTAL:
      case WordType.LEFT:
      case WordType.RIGHT:
        return this.length;
    }
  }

  get height() {
    switch (this.type) {
      case WordType.HORIZONTAL:
        return 1;

      case WordType.VERTICAL:
      case WordType.LEFT:
      case WordType.RIGHT:
        return this.length;
    }
  }

  *vectors() {
    const [dX, dY] = WordDirection[this.type];
    let aX = 0, aY = 0;
    if (dX < 0) aX = this.width - 1;
    if (dY < 0) aY = this.height - 1;

    for (let i = 0; i < this.length; i++) {
      yield [this.x + i * dX + aX, this.y + i * dY + aY, this.word[i]] as [
        x: number,
        y: number,
        c: string
      ];
    }
  }

  constructor(word: TWord<T>, type: WordType) {
    let meta!: T | undefined;
    if (typeof word === 'object') {
      meta = word.meta;
      word = word.word;
    }

    Object.defineProperties(this, {
      word: { enumerable: true, value: word, writable: false, configurable: false },
      length: { enumerable: true, value: word.length, writable: false, configurable: false },
      type: { enumerable: true, value: type },
      meta: { enumerable: true, value: meta, writable: false, configurable: false }
    });
  }
}