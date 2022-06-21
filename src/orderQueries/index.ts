import { OrderStatement, OrderQuery } from '../types'
import { Knex } from 'knex'

// const ORDER_DIRECTION_REGEX = /\s+\w+(\s+asc|\s+desc)?([\s,]*\w+(\s+asc|\s+desc)?)*$/
const ORDER_DIRECTION_REGEX = /\s+\w+(\s+asc|\s+desc)*$/

export const orderQueries = <
  TRecord extends Record<string, unknown>,
  TResult extends unknown[],
>(
  orderStatements: OrderStatement[],
  queryBuilder: Knex.QueryBuilder<TRecord, TResult>,
): OrderQuery[] => {
  return orderStatements.map((orderItem) => {
    if (orderItem.type === 'orderByRaw') {
      const directionMatches = orderItem.value.sql.match(ORDER_DIRECTION_REGEX)
      const direction =
        directionMatches && directionMatches[0].trim().toLowerCase() === 'desc'
          ? 'DESC'
          : 'ASC'

      return {
        query: queryBuilder.client
          .raw(
            orderItem.value.sql.replace(ORDER_DIRECTION_REGEX, ''),
            orderItem.value.bindings,
          )
          .toQuery() as string,
        direction,
      }
    } else if (orderItem.type === 'orderByBasic') {
      return {
        query: `${orderItem.value}`,
        direction: orderItem.direction,
      }
    } else {
      throw new Error('Not implemented')
    }
  })
}
