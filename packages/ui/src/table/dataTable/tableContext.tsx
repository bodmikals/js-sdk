import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Column, SortOrder } from "./col";
import { DataGridContextState } from "../dataGrid/dataGridContext";
import { DataFilterProps } from "../dataGrid/dataFilter";

export type DataMetaData = {
  count: number;
  page: number;
  pageSize: number;
};

export type TableContextState = {
  columns: Column[];
  dataSource: any[];
  meta: DataMetaData;
  sortKey?: string;
  sortOrder?: SortOrder;
  expandedRowKeys?: string[];
  canExpand?: boolean;
  toggleExpandRow: (key: string) => void;
  onSort: (key: string) => void;
  getLeftFixedColumnsWidth: (index: number) => number;
  getRightFixedColumnsWidth: (index: number) => number;
  getLeftFixedColumnsPosition: () => number;
  getRightFixedColumnsPosition: () => number;
} & DataGridContextState;

export const TableContext = createContext<TableContextState>(
  {} as TableContextState
);

export const useTable = () => {
  return useContext(TableContext);
};

export const defaultSorter = (
  r1: any,
  r2: any,
  sortOrder: SortOrder,
  key: string
) => {
  if (sortOrder === "asc") {
    return Number(r1[key]) - Number(r2[key]);
  }
  return Number(r2[key]) - Number(r1[key]);
};

export const TableProvider: FC<
  PropsWithChildren<{
    columns: Column[];
    dataSource?: any[] | null;
    canExpand?: boolean;
    multiExpand?: boolean;
    meta?: DataMetaData;
    onSort?: (sortKey: string, sort: SortOrder) => void;
  }>
> = (props) => {
  const [sortKey, setSortKey] = useState<[string, SortOrder] | undefined>();
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  // const [sortOrder, setSortOrder] = useState<SortOrder>();

  const getLeftFixedColumnsWidth = (index: number) => {
    return props.columns.reduce((acc, cur, i) => {
      if (i < index && cur.fixed === "left") {
        return acc + (cur.width || 0);
      }
      return acc;
    }, 0);
  };

  const getRightFixedColumnsWidth = (index: number) => {
    return props.columns.reduce((acc, cur, i) => {
      if (i > index && cur.fixed === "right") {
        return acc + (cur.width || 0);
      }
      return acc;
    }, 0);
  };

  const getLeftFixedColumnsPosition = () => {
    let left = 0;

    for (let index = 0; index < props.columns.length; index++) {
      const element = props.columns[index];
      if (element.fixed !== "left") {
        break;
      } else {
        left += element.width || 0;
      }
    }
    return left;
  };

  const getRightFixedColumnsPosition = () => {
    let right = 0;

    for (let index = props.columns.length - 1; index >= 0; index--) {
      const element = props.columns[index];
      if (element.fixed !== "right") {
        break;
      } else {
        right += element.width || 0;
      }
    }
    return right;
  };

  const dataSource = useMemo(() => {
    if (!props.dataSource) {
      return [];
    }
    if (!sortKey || !sortKey[0]) {
      return props.dataSource || [];
    }

    /**
     * if onSort is not provided, return the original dataSource, ignore the internal sort
     */
    if (typeof props.onSort === "function") {
      return props.dataSource;
    }

    // sort by onSort function
    return [...props.dataSource].sort((r1, r2) => {
      if (typeof sortKey[0] === "string") {
        const col = props.columns.find((col) => col.dataIndex === sortKey[0]);
        let sorter =
          typeof col?.onSort === "function" ? col.onSort : defaultSorter;

        return sorter(r1, r2, sortKey[1], sortKey[0]);
      }
      return 0;
    });
  }, [props.dataSource, sortKey]);

  const toggleExpandRow = useCallback((key: string) => {
    setExpandedRowKeys((prev) => {
      if (prev[0] === key) {
        return [];
      }
      return [key];
      // if (prev.includes(key)) {
      //   return prev.filter((k) => k !== key);
      // }

      // return [...prev, key];
    });
  }, []);

  const onSort = (key: string) => {
    setSortKey((prev) => {
      if (prev?.[0] === key) {
        if (prev?.[1] === "asc") {
          return undefined;
        }

        return [key, "asc" as SortOrder];
      }

      return [key, "desc" as SortOrder];
    });

    if (typeof props.onSort === "function" && sortKey?.length === 2) {
      setTimeout(() => {
        props.onSort!(sortKey[0], sortKey[1]);
      }, 0);
    }
  };

  const meta = useMemo(() => {
    return (
      props.meta || {
        count: dataSource.length,
        page: 1,
        pageSize: dataSource.length,
      }
    );
  }, [props.meta, dataSource]);

  return (
    <TableContext.Provider
      value={{
        columns: props.columns,
        dataSource: dataSource,
        meta,
        sortKey: sortKey?.[0],
        sortOrder: sortKey?.[1],
        canExpand: props.canExpand,
        expandedRowKeys,
        toggleExpandRow,
        onSort: onSort,
        getLeftFixedColumnsWidth,
        getRightFixedColumnsWidth,
        getLeftFixedColumnsPosition,
        getRightFixedColumnsPosition,
      }}
    >
      {props.children}
    </TableContext.Provider>
  );
};
