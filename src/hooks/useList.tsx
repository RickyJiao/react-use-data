import { useCallback, useMemo, useState, useEffect } from 'react';
import { UseListParams, useListFn } from '../typing/index';

const useList: useListFn = ({
  fetchData,
  defaultData,
  initalState = {},
  pageSize = 8
}: UseListParams) => {
  const DEFAULT_META = Object.freeze({
    page: -1,
    pageSize,
    totalPage: null,
  });

  const DEFALUT_DATA_ITEM = Object.freeze({
    isFetching: false,
    meta: DEFAULT_META,
    data: Object.freeze(defaultData)
  });

  const DATA = initalState;

  return context => {
    const uuid = JSON.stringify(context);
    const item = DATA[uuid] || DEFALUT_DATA_ITEM;
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
        const item = DATA[uuid];
        const datas = [
          ...(item ? item.data : []),
          ...data
        ];

        DATA[uuid] = {
          isFetching: false,
          meta,
          data: datas
        };

        setFetching(false);
        setMeta(meta);
        setData(datas);
      });
    }, [uuid]);

    const loadMore = useCallback(() => {
      if (hasMore) {
        const { page } = meta;

        fetchPage(page + 1);
      }
    }, [meta, hasMore]);

    useEffect(() => {
      const item = DATA[uuid] || DEFALUT_DATA_ITEM;

      if (item.data !== data) {
        setMeta(item.meta);
        setData(item.data);
        setFetching(item.isFetching);
      }
    }, [uuid]);

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
