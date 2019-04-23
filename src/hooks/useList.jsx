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

  return (context) => {
    const item = DATA[context] || DEFALUT_DATA_ITEM;
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
        context
      }).then((result) => {
        const { meta, data } = result;
        const item = DATA[context];
        const datas = [
          ...(item ? item.data : []),
          ...data
        ];

        DATA[context] = {
          isFetching: false,
          meta,
          data: datas
        };

        setFetching(false);
        setMeta(meta);
        setData(datas);
      });
    }, [context]);

    const loadMore = useCallback(() => {
      if (hasMore) {
        const { page } = meta;

        fetchPage(page + 1);
      }
    }, [meta, hasMore]);

    useEffect(() => {
      const item = DATA[context] || DEFALUT_DATA_ITEM;

      setMeta(item.meta);
      setData(item.data);
      setFetching(item.isFetching);
    }, [context]);

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
