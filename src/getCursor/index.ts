import { encodeCursor } from '../cursorEncoder';

type Record = {
  [key: string]: unknown;
};

const getCursor = <T extends Record>(item: T) => {
  const cursorColumns = Object.keys(item)
    .filter((name) => name.match(/_cursor_\d+/))
    .sort();
  const values = cursorColumns.map((column) => item[column]);

  return encodeCursor(values);
};

export default getCursor;
