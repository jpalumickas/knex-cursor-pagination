import { Knex } from 'knex'
import { OrderQuery, JsonValue } from '../types'

type OrderDirection = 'ASC' | 'DESC'
const COMPARISON_OPERATORS = {
  before: {
    ASC: '<',
    DESC: '>',
  },
  after: {
    ASC: '>',
    DESC: '<',
  },
}

export const filterQuery = <
  TRecord extends Record<string, unknown>,
  TResult extends unknown[],
>(
  queryBuilder: Knex.QueryBuilder<TRecord, TResult>,
  orderQueries: OrderQuery[],
  cursor: JsonValue[],
  argDirection: 'after' | 'before',
) => {
  queryBuilder = queryBuilder.where((builder) => {
    orderQueries.map((orderQuery, index) => {
      const prevOrderQueries = orderQueries.slice(0, index)

      return builder.orWhere((innerBuilder) => {
        prevOrderQueries.forEach((prevOrderQuery, prevIndex) => {
          innerBuilder.where(
            queryBuilder.client.raw(prevOrderQuery.query),
            cursor[prevIndex],
          )
        })

        const direction = orderQuery.direction.toUpperCase() as OrderDirection

        innerBuilder.where(
          queryBuilder.client.raw(orderQuery.query),
          COMPARISON_OPERATORS[argDirection][direction],
          cursor[index],
        )
      })
    })
  })

  return queryBuilder
}
