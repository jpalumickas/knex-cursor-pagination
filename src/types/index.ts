import { Knex } from 'knex'

export type JsonValue = number | string | null
export type OrderDirection = 'ASC' | 'DESC'

export type OrderStatement =
  | {
      grouping: 'order'
      type: 'orderByRaw'
      value: {
        sql: string
        bindings: Knex.RawBinding[]
      }
    }
  | {
      grouping: 'order'
      type: 'orderByBasic'
      value: string
      direction: OrderDirection
    }

export type OrderQuery = {
  query: string
  direction: OrderDirection
}

export type QueryBuilderStatement =
  | {
      grouping: string
    }
  | OrderStatement

export interface ConnectionArguments {
  first?: number | null
  after?: string | null
  last?: number | null
  before?: string | null
}

export interface RelayConnectionOptions<TRecord, TResult> {
  defaultLimit?: number
  query: Knex.QueryBuilder<TRecord, TResult>
  args: ConnectionArguments
  formatNode?: (node: TRecord) => TRecord
  executeQuery?: (
    query: Knex.QueryBuilder<TRecord, TResult>,
  ) => Promise<TResult>
}
