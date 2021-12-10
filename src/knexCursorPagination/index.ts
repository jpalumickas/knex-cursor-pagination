import { Knex } from 'knex';
import { decodeCursor } from '../cursorEncoder';
import { orderQueries as getOrderQueries } from '../orderQueries';
import { OrderStatement, ConnectionArguments, JsonValue } from '../types';
import { filterQuery } from '../filterQuery';

export const knexCursorPagination = <
  TRecord extends Record<string, unknown>,
  TResult extends unknown[]
>(
  queryBuilder: Knex.QueryBuilder<TRecord, TResult>,
  { first, after, before, last }: ConnectionArguments
) => {
  const orderData: OrderStatement[] = (queryBuilder as any)._statements.filter(
    (statement: { grouping: string }) => statement.grouping === 'order'
  );

  const orderQueries = getOrderQueries<TRecord, TResult>(
    orderData,
    queryBuilder
  );

  // Add cursor selects
  orderQueries.forEach((orderQuery, index) => {
    queryBuilder = queryBuilder.select(
      queryBuilder.client.raw(`${orderQuery.query} AS _cursor_${index}`)
    );
  });

  if (first) {
    queryBuilder = queryBuilder.limit(first);
  } else if (last) {
    queryBuilder = queryBuilder.limit(last);
  }

  if (after) {
    //Forward pagination
    const cursor: JsonValue[] = decodeCursor(after);
    if (cursor.length !== orderQueries.length) {
      throw new Error('Cursor has different length than order data');
    }

    queryBuilder = filterQuery(queryBuilder, orderQueries, cursor, 'after');
  } else if (before) {
    // Backwards pagination
    const cursor: JsonValue[] = decodeCursor(before);
    if (cursor.length !== orderQueries.length) {
      throw new Error('Cursor has different length than order data');
    }

    // TODO: Invert order directions

    queryBuilder = filterQuery(queryBuilder, orderQueries, cursor, 'after');
  }

  return queryBuilder;
};
