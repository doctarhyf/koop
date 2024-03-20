import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import { loadAllItems, loadAllItemsWhereRowEqVal } from "../utils/db";

export default function useItemsLoader(tableName, rowName, rowVal) {
  const [loadingItems, setLoadingtItems] = useState(false);
  const [error, seterror] = useState(null);
  const [items, setitems] = useState([]);

  useEffect(() => {
    async function loadItems(tableName, rowName, rowVal) {
      setLoadingtItems(true);
      if (tableName) {
        let res;

        if (rowName && rowVal) {
          res = await loadAllItemsWhereRowEqVal(tableName, rowName, rowVal);
          setLoadingtItems(false);
        } else {
          res = await loadAllItems(tableName);
          setLoadingtItems(false);
        }

        console.error("res => ", res);

        if (res.code) {
          setitems([]);
          seterror(res.error);
        } else {
          setitems(res);
          seterror(null);
        }
      } else {
        console.log("cant load table : " + tableName);
      }
    }

    loadItems(tableName, rowName, rowVal);

    return () => {};
  }, [tableName]);

  return [loadingItems, items, error];
}
