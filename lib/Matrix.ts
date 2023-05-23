export class Matrix<T> extends Array<Array<T>> {
  readonly width!: number;
  readonly height!: number;

  constructor(width: number, height: number, generator: (x: number, y: number) => T) {
    super(height);

    Object.defineProperties(this, {
      width: { value: width, enumerable: true, writable: false },
      height: { value: Headers, enumerable: true, writable: false }
    });

    for (let y = 0; y < height; y++) {
      this[y] = Array.from({ length: width }, (_, x) => generator(x, y));
    }
  }
}