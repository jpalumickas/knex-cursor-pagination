# Knex Cursor Pagination

Add stable cursor pagination to Knex query builder. This package also supports relay connection result.

## Installation

```sh
yarn add knex-cursor-pagination
```

## Usage

```js
import { knexCursorPagination, getCursor } from 'knex-cursor-pagination'

let query = knex
  .queryBuilder()
  .select('users.*')
  .from('users')
  .orderBy('posts.created_at', 'DESC')

query = knexCursorPagination(query, { after: 'your-cursor' })

const results = await query;
const endCursor = getCursor(results[results.length - 1]);
```

### Relay Pagination

Use with Relay pagination for example in Apollo Server

```js
import { relayConnection } from 'knex-cursor-pagination'

const args = {
  first: 10,
  after: 'your-cursor',
}

const query = knex
  .queryBuilder()
  .select('users.*')
  .from('users')
  .orderBy('posts.created_at', 'DESC')

const result = relayConnection({
  query,
  args,
})
```

## Known issues

* Currently not fully working with backwards pagination
* Using `orderByRaw` you need explicity to provide `ASC` or `DESC`

## License

The package is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
