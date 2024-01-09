import { FC, useEffect } from "react";
import { ListViewFull } from "./listview";
import { MarketsType, useMarkets } from "@orderly.network/hooks";
import { useDataSource } from "../useDataSource";
import { API } from "@orderly.network/types";
import { FavoriteButton } from "./favoriteButton";

export const AllTabPane: FC<{
    onClose?: () => void,
    maxHeight: number | undefined,
    activeIndex: number,
    setActiveIndex: React.Dispatch<React.SetStateAction<number>>,
    fitlerKey: string,
    onItemClick?: (symbol: API.Symbol) => void,
}> = (props) => {
    const { activeIndex, setActiveIndex, onItemClick, fitlerKey } = props;

    const [data, { addToHistory, favoriteTabs, updateFavoriteTabs, updateSymbolFavoriteState }] = useMarkets(MarketsType.ALL);
    const [dataSource, { onSearch, onSort }] = useDataSource(
        data
    );

    useEffect(() => {
        onSearch(fitlerKey);
    }, [fitlerKey]);

    return (<ListViewFull
        // @ts-ignore
        // ref={listviewRef}
        activeIndex={activeIndex}
        dataSource={dataSource}
        onSort={onSort}
        maxHeight={props.maxHeight}
        updateActiveIndex={(index: number) => setActiveIndex(index)}
        // @ts-ignore
        onItemClick={(item) => {
            onItemClick?.(item);
            addToHistory(item);
        }}
        prefixRender={(item, index) => {
            return (<FavoriteButton
                symbol={item}
                tabs={favoriteTabs}
                updateFavoriteTabs={updateFavoriteTabs}
                updateSymbolFavoriteState={updateSymbolFavoriteState}
            />);
        }}
    />);
}