import { Matrix } from "./Matrix";

export class VectorKey {
  static #keys = new Map<number, Map<number, VectorKey>>();

  constructor(
    public x: number,
    public y: number
  ) { }

  *[Symbol.iterator]() {
    yield this.x;
    yield this.y;
  }

  static key(x: number, y: number) {
    let row = this.#keys.get(y);

    if (!row) {
      row = new Map<number, VectorKey>();
      this.#keys.set(y, row);
    }

    let column = row.get(x);

    if (!column) {
      column = new VectorKey(x, y);
      row.set(x, column);
    }

    return column;
  }
}

export class VectorMap<T> {
  #map = new Map<VectorKey, T>();

  #minX = Infinity;
  #minY = Infinity;
  #maxX = -Infinity;
  #maxY = -Infinity;

  get(x: number, y: number, defaultValue?: T | (() => T)) {
    const generateDefault = (defaultValue?: T | (() => T)): T | undefined => {
      if (defaultValue instanceof Function)
        defaultValue = defaultValue();

      if (defaultValue) {
        this.set(x, y, defaultValue);
        return defaultValue;
      }
    };

    return this.#map.get(VectorKey.key(x, y)) ?? generateDefault(defaultValue);
  }

  set(x: number, y: number, v: T) {
    this.#maxX = Math.max(x, this.#maxX);
    this.#maxY = Math.max(y, this.#maxY);
    this.#minX = Math.min(x, this.#minX);
    this.#minY = Math.min(y, this.#minY);

    return this.#map.set(VectorKey.key(x, y), v);
  }

  has(x: number, y: number) {
    return this.#map.has(VectorKey.key(x, y));
  }

  *entries() {
    for (const [key, value] of this.#map) {
      yield [key, value] as [VectorKey, T];
    }
  }

  matrix(): Matrix<T | undefined>;
  matrix<E>(nullValue: E | ((x: number, y: number) => E)): Matrix<T | E>;
  matrix<E>(nullValue?: E | ((x: number, y: number) => E)): Matrix<T | E | undefined> {
    return new Matrix(this.#maxX - this.#minX, this.#maxY - this.#minY, (x, y) => (
      this.get(x + this.#minX, y + this.#minY) ?? (nullValue instanceof Function ? nullValue(x, y) : nullValue)
    ));
  }

  clear() {
    return this.#map.clear();
  }
}