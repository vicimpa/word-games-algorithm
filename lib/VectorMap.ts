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

  get(x: number, y: number, defaultValue?: T | (() => T)) {
    const key = VectorKey.key(x, y);

    const generateDefault = (defaultValue?: T | (() => T)): T | undefined => {
      if (defaultValue instanceof Function)
        defaultValue = defaultValue();

      if (defaultValue) {
        this.#map.set(key, defaultValue);
        return defaultValue;
      }
    };

    return this.#map.get(key) ?? generateDefault(defaultValue);
  }

  set(x: number, y: number, v: T) {
    const key = VectorKey.key(x, y);
    return this.#map.set(key, v);
  }

  has(x: number, y: number) {
    const key = VectorKey.key(x, y);
    return this.#map.has(key);
  }

  *entries() {
    for (const [key, value] of this.#map) {
      yield [key, value] as [VectorKey, T];
    }
  }

  clear() {
    return this.#map.clear();
  }
}