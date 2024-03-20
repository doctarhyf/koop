import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import { loadAllItems, loadAllItemsWhereRowEqVal } from "../utils/db";

export default function useFetch(apiURL, noCache = false) {
  const [loading, setloading] = useState(false);
  const [data, setdata] = useState(null);
  const [error, seterror] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setloading(true);
      try {
        let cacheControl = undefined;
        if (noCache) {
          cacheControl = { cache: "no-cache" };
        }
        const response = await fetch(apiURL, cacheControl);

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setdata(data);
        setloading(false);
        console.error("Data fetched successfully:", data);
        // Handle the fetched data
      } catch (error) {
        setloading(false);
        console.error("There was a problem with the request:", error);
        seterror(error);
        // Handle errors
      }
    };

    fetchData();
  }, [apiURL]);

  return [loading, data, error];
}
