import { useEffect, useState } from 'react';
import { UseDetailParams, useDetailFn } from '../typing/index';

const useDetail: useDetailFn = ({
  fetchData,
  defaultData,
  initalState = {},
  eanbleEmptyRequest = true
}: UseDetailParams) => {
  const DEFALUT_ITEM = Object.freeze({
    isFetching: false,
    detail: Object.freeze(defaultData)
  });

  const DATA = initalState;

  return context => {
    const uuid = JSON.stringify(context);
    const item = DATA[uuid] || DEFALUT_ITEM;
    const [isFetching, setFetching] = useState(item.isFetching);
    const [detail, setDetail] = useState(item.detail);

    useEffect(() => {
      if (!eanbleEmptyRequest && !context) {
        return;
      }

      if (!DATA[uuid]) {
        setFetching(true);

        fetchData(context).then((result) => {
          const { data } = result;

          DATA[uuid] = {
            isFetching: false,
            detail: data
          };

          setDetail(data);
          setFetching(false);
        });
      }
    }, [uuid]);

    return {
      detail,
      isFetching
    };
  };
};

export default useDetail;
