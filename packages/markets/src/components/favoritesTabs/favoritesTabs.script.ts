import { useEffect, useRef, useState } from "react";
import { FavoriteInstance } from "../../type";

export type UseFavoritesTabScriptOptions = {
  favorite: FavoriteInstance;
};

export type UseFavoritesTabScriptReturn = ReturnType<
  typeof useFavoritesTabScript
>;

export function useFavoritesTabScript(options: UseFavoritesTabScriptOptions) {
  const { favorite } = options;
  const {
    favorites,
    favoriteTabs,
    selectedFavoriteTab,
    updateFavoriteTabs,
    updateSelectedFavoriteTab,
    updateFavorites,
  } = favorite;

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);
  const [inputWidth, setInputWidth] = useState(50);

  const onEdit = (item: any) => {
    setEditing(true);
    setValue(item.name);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(-1, -1);
    }, 0);
  };

  const updateCurTab = () => {
    updateFavoriteTabs(
      {
        ...selectedFavoriteTab,
        name: value,
      },
      { update: true }
    );
    setEditing(false);
    setOpen(false);
  };

  const addTab = () => {
    const newTab = {
      name: `WatchList_${favoriteTabs.length}`,
      id: Date.now(),
    };
    updateFavoriteTabs(newTab, { add: true });
    updateSelectedFavoriteTab(newTab);
  };

  const delTab = (selectedTab: any) => {
    updateFavoriteTabs(selectedTab, { delete: true });

    setTimeout(() => {
      // remove all symbol favorite in this tab
      const _favorites = favorites.map((item) => ({
        ...item,
        tabs: item.tabs?.filter((tab) => tab.id !== selectedTab.id),
      }));

      updateFavorites(_favorites);

      // auto selected last tab
      const tabs = favoriteTabs.filter((item) => item.id !== selectedTab.id);
      const tab = tabs?.[tabs?.length - 1] || tabs?.[0];
      updateSelectedFavoriteTab(tab);
    }, 0);
  };

  useEffect(() => {
    if (value) {
      const rect = spanRef.current?.getBoundingClientRect();
      setInputWidth(Math.max((rect?.width || 0) + 14, 50));
    }
  }, [value]);

  return {
    favorite,
    open,
    setOpen,
    inputRef,
    inputWidth,
    spanRef,
    editing,
    value,
    onValueChange: setValue,
    onEdit,
    updateCurTab,
    addTab,
    delTab,
  };
}
