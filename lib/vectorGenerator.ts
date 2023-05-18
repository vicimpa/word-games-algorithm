interface IGenerate {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function* vectorGenerator<T extends IGenerate>({ x, y, width, height }: T) {
  for (let Y = y; Y < y + height; Y++) {
    for (let X = x; X < x + width; X++) {
      yield [X, Y] as [number, number];
    }
  }
}