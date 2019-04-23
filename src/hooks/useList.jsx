import {
  useCallback, useMemo, useState, useEffect
} from 'react';

const useList = ({
  fetchData,
  initalState,
  defaultData,
  pageSize = 8
}) => {
  const DEFAULT_META = Object.freeze({
    page: -1,
    pageSize,
    totalPage: null,
  });

  const DEFALUT_DATA_ITEM = Object.freeze({
    isFetching: true,
    meta: DEFAULT_META,
    data: Object.freeze(defaultData)
  });

  const DATA = initalState || {};

  return (tag) => {
    const item = DATA[tag] || DEFALUT_DATA_ITEM;
    const [meta, setMeta] = useState(item.meta);
    const [data, setData] = useState(item.data);
    const [isFetching, setFetching] = useState(item.isFetching);

    const hasMore = useMemo(() => {
      const { page, totalPage } = meta;
      const nextPage = page + 1;

      return !totalPage || nextPage < totalPage;
    }, [meta]);

    const fetchPage = useCallback((page) => {
      const { pageSize } = meta;

      setFetching(true);

      fetchData({
        page,
        pageSize,
        tag
      }).then((result) => {
        const { meta, data } = result;
        const item = DATA[tag];
        const datas = [
          ...(item ? item.data : []),
          ...data
        ];

        DATA[tag] = {
          isFetching: false,
          meta,
          data: datas
        };

        setFetching(false);
        setMeta(meta);
        setData(datas);
      });
    }, [tag]);

    const loadMore = useCallback(() => {
      if (hasMore) {
        const { page } = meta;

        fetchPage(page + 1);
      }
    }, [meta, hasMore]);

    useEffect(() => {
      const item = DATA[tag] || DEFALUT_DATA_ITEM;

      setMeta(item.meta);
      setData(item.data);
      setFetching(item.isFetching);
    }, [tag]);

    return {
      isFetching,
      data,
      meta,
      hasMore,
      loadMore
    };
  };
};

export default useList;
