import { ColisionMap } from "./ColisionMap";
import { FV, fv } from "./utils";

interface IOptions {
  item?: FV<string, [input: string]>;

  empty?: FV<string>;
}

export function renderConsole(matrix: ColisionMap | string[][], {
  item = v => v,
  empty = ' '
} = {} as IOptions) {
  if (matrix instanceof ColisionMap)
    return renderConsole(matrix.matrix(), { item, empty });

  matrix = [...matrix].map(e => e ?? []);
  const rows: string[] = [];
  let maxWidth = 0;

  for (const row of matrix) {
    const s = '│ ' + row.map(e => e ? fv(item, e) : fv(empty)).join(' ') + ' │';
    rows.push(s);
    if (maxWidth < row.length) maxWidth = row.length;
  };


  console.log('┌' + '─'.repeat(maxWidth * 2 + 1) + '┐');
  console.log(rows.join('\n'));
  console.log('└' + '─'.repeat(maxWidth * 2 + 1) + '┘');
}