import { Knex } from 'knex';

export type JsonValue = number | string | null;
export type OrderDirection = 'ASC' | 'DESC';

export type OrderStatement =
  | {
      grouping: 'order';
      type: 'orderByRaw';
      value: {
        sql: string;
        bindings: Knex.RawBinding[];
      };
    }
  | {
      grouping: 'order';
      type: 'orderByBasic';
      value: string;
      direction: OrderDirection;
    };

export type OrderQuery = {
  query: string;
  direction: OrderDirection;
};

export type QueryBuilderStatement =
  | {
      grouping: string;
    }
  | OrderStatement;

export interface ConnectionArguments {
  first?: number | null;
  after?: string | null;
  last?: number | null;
  before?: string | null;
}
