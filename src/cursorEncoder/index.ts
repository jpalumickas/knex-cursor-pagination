export const encodeCursor = <Cursor = Record<string, string | number> | string>(
  cursor: Cursor,
) => Buffer.from(JSON.stringify(cursor)).toString('base64')

export const decodeCursor = (cursor: string) =>
  JSON.parse(Buffer.from(cursor, 'base64').toString('ascii'))
