# react-use-data

React use data is an local store to share data across components. Redux is an centeral store, normally you only have one store for all entities data. It's sutiable for large application. Sometimes, we don't really want the centeral large store. Rather, we want individual small store for different entities. That's why we have **react-use-data**.

## Installation

Using npm:

```sh
$ npm install --save react-use-data
```

Using yarn:

```sh
$ yarn add react-use-data
```

## Example

Create your own your `blog list` entity store `useBlogList.jsx`

```js
import { useList } from 'react-use-data';

export default useList({
  fetchData: ({
    page,
    pageSize,
    context
  }) => {
    return axios.get('/blog', {
      params: {
        page,
        pageSize,
        context
      }
    }).then(response => {
      return {
        data: [],
        meta: {
          page: 2,
          pageSize: 8,
          totalPage: 5,
        }
      }
    });
  },
  pageSize: 8
});

```

Use `useBlogList.jsx` in your react component to retrieve data:

```js
import React, { useCallback, useMemo } from 'react';
import useBlogList from './useBlogList';

export default function BlogListPage() {
  const { isFetching, data, hasMore, loadMore } = useBlogList();

  return (
    <div>
      {isFetching && (
        <span>Loading...</span>
      )}
      {!hasMore && (
        <span>No more data</span>
      )}
      <ul>
        {
          data.map(item => (
            <p>{item.title}</p>
          ))
        }
      </ul>
      <button disabled={!hasMore} onClick={loadMore}>Load more</button>
    </div>
  );
};
```

The server response should return pagination information in `meta` property.

Use `useDetail` to create your `blog detail` entity store

```js
import { useDetail } from 'react-use-data';

export default useDetail({
  fetchData: (uuid) => {
    return axios.get(`/blog/${uuid}`);
  }
});
```

Use `useBlogDetail.jsx` in your react component to retrieve data:

```js
import React, { useCallback, useMemo } from 'react';
import useBlogDetail from './useBlogDetail';

export default function BlogListPage() {
  const blogUuid = 'uuid';
  const { isFetching, detail } = useBlogDetail(blogUuid);

  return (
    <div>
      {isFetching && (
        <span>Loading...</span>
      )}
      <div>
        {detail && (
          detail.title
        )}
      </div>
    </div>
  );
};
```

## Server side render

Use intialState to setup detail entity state
```js
  import { useDetail } from 'react-use-data';

  export default useDetail({
    fetchData,
    initalState: {
      'uuid-1': {...}
    }
  });

  ```

## Contributing

Please feel free to submit any issues or pull requests.

## License

MIT
