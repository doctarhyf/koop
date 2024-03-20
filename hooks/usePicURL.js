import { useState, useEffect } from "react";
import { getPublicUrl } from "../utils/db";

const usePicURL = (filePath) => {
  const [loadingPic, setLoading] = useState(true);
  const [picUrl, setPicUrl] = useState(null);

  useEffect(() => {
    setLoading(true);

    if (filePath !== null) {
      getPublicUrl(filePath, (url) => {
        setPicUrl(url);

        console.log(`public url : `, url);

        setLoading(false);
      });
    } else {
      console.log("file path is null! cant get public url of null path!");
      setLoading(false);
    }

    return () => {
      // Cleanup or additional logic if needed
    };
  }, [filePath]);

  return [loadingPic, picUrl];
};

export default usePicURL;
