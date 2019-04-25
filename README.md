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

Note: the data is shared across different components which means the `fetchData` is only called **one time** for one entity item. The responsed is cached in local samll individual store.

### useDetail

`useDetail` is an interface to create a store to store entity item based on entity **uuid**. For example, you have a search box, the search items are based on search keyword. It is suitable to use `useDetail` to cache **search items** based on **search keyword**. 

Use `useDetail` to create your `search hook` entity store

```js
// useSearch.jsx
import { useDetail } from 'react-use-data';

export default useDetail({
  fetchData: (keyword) => {
    return axios.get(`/search/${keyword}`);
  }
});

// SearchBox.jsx
import React, { useState } from 'react';
import useSearch from './useSearch';

export default function SearchBox() {
  const [keyword, setKeyword] = useState('');
  const handleChange = useCallback((e) => {
    const { value: keyword } = e.target;

    setKeyword(keyword);
  }, []);
  const { isFetching, detail: searchResults } = useSearch(keyword);

  return (
    <div>
      {isFetching && (
        <span>Loading...</span>
      )}
      <div>
        {searchResults && (
          <ul>
            {
              searchResults.map(item => (
                <p>{item.title}</p>
              ))
            }
          </ul>
        )}
      </div>
      <div>
        <label>Search: </label>
        <input type="text" value={keyword} onChange={handleChange} />
      </div>
    </div>
  );
};
```

### useList

`useList` is an interface to create a store for **pagination items**. For example, you have a blog list page to list all blogs, those blogs are list page by page. Once the page scorlls to bottom, call **loadMore** to show another pages. This is suitable to use `useList` to paginate blogs. 

Create your own your `blog list` entity store `useBlogList.jsx`

```js
// useBlogList
import { useList } from 'react-use-data';

export default useList({
  pageSize: 8,
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
  }
});

// BlogListPage
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
