# react-use-data

React use data is an local store hook to share data across components. Redux is an centeral store, normally there is only one store to represent entities data. It's suitable for large application. For some application, we don't really need large centeral store. Rather than, we prefer small individual store for different entities. That's why we created **react-use-data**, individual small store based on react hooks.

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

Note: the data is shared across different components which means the `fetchData` is only called **one time** for one entity item. The response is cached in local small individual store.

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


Use `useDetail` to create your `search hook` entity store

```js
import { useDetail } from 'react-use-data';

export default useDetail({
  fetchData: (keyword) => {
    return axios.get(`/search/${keyword}`);
  }
});
```

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


## Server Side Rendering

Use intialState to setup detail entity state
```js
  import { useDetail } from 'react-use-data';

  export default useDetail({
    fetchData,
    initalState: {
      'uuid1': {...},
      'uuid2': {...}
    }
  });

  ```

## Contributing

Please feel free to submit any issues or pull requests.

## License

MIT
