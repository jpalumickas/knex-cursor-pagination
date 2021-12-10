import { Knex } from 'knex';
import { ConnectionArguments } from '../types';
import { getCursor } from '../getCursor';
import { knexCursorPagination } from '../knexCursorPagination';

type Options<TRecord, TResult> = {
  defaultLimit?: number;
  query: Knex.QueryBuilder<TRecord, TResult>;
  args: ConnectionArguments;
  formatNode?: (node: TRecord) => TRecord;
  executeQuery?: (
    query: Knex.QueryBuilder<TRecord, TResult>
  ) => Promise<TResult>;
};

export const relayConnection = async <
  TRecord extends Record<string, unknown>,
  TResult extends TRecord[]
>({
  query,
  defaultLimit = 20,
  args = { first: defaultLimit },
  formatNode = (node) => node,
  executeQuery = async (query) => {
    return (await query) as TResult;
  },
}: Options<TRecord, TResult>) => {
  if (!args.first && !args.last) {
    if (args.before) {
      args.last = defaultLimit;
    } else {
      args.first = defaultLimit;
    }
  }

  // Forward pagination
  if (args.first) {
    query = knexCursorPagination<TRecord, TResult>(query, {
      first: args.first + 1,
      after: args.after,
    });

    const allRecords: TResult = await executeQuery(query);
    const records = allRecords.slice(0, args.first);

    return {
      edges: records.map((record) => ({
        node: formatNode(record),
        cursor: getCursor(record),
      })),
      pageInfo: {
        hasNextPage: allRecords.length > args.first,
        hasPreviousPage: !!args.after,
        endCursor:
          records.length > 0 ? getCursor(records[records.length - 1]) : null,
        startCursor: records.length > 0 ? getCursor(records[0]) : undefined,
      },
      nodes: records.map((record) => formatNode(record)),
    };
  } else if (args.last) {
    query = knexCursorPagination<TRecord, TResult>(query, {
      last: args.last + 1,
      before: args.before,
    });

    const allRecords: TResult = await executeQuery(query);
    const records = allRecords.slice(0, args.last);

    return {
      edges: records.map((record) => ({
        node: formatNode(record),
        cursor: getCursor(record),
      })),
      pageInfo: {
        hasNextPage: allRecords.length > args.last,
        hasPreviousPage: !!args.before,
        endCursor:
          records.length > 0 ? getCursor(records[records.length - 1]) : null,
        startCursor: records.length > 0 ? getCursor(records[0]) : undefined,
      },
      nodes: records.map((record) => formatNode(record)),
    };
  } else {
    throw new Error('Arguments first or last must be provided.');
  }
};
