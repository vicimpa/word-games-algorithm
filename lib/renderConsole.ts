import { ColisionMap } from "./ColisionMap";
import { Matrix } from "./Matrix";
import { FV, fv } from "./utils";

interface IOptions {
  item?: FV<string, [input: string]>;

  empty?: FV<string>;
}

export function renderConsole(matrix: ColisionMap | Matrix<string | undefined>, {
  item = v => v,
  empty = ' '
} = {} as IOptions) {
  if (matrix instanceof ColisionMap)
    return renderConsole(matrix.matrix(), { item, empty });

  const rows: string[] = [];
  const line = '─'.repeat(matrix.width * 2 + 1);

  for (const row of matrix) {
    const s = '│ ' + row.map(e => e ? fv(item, e) : fv(empty)).join(' ') + ' │';
    rows.push(s);
  };

  console.log([
    '┌' + line + '┐',
    ...rows,
    '└' + line + '┘',
  ].join('\n'));
}