import React, { useEffect, useState } from "react";

import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";
import { KOOP_BUCKET_NAME, supabase } from "../utils/supabase";

const useFileUpload = (
  remotePath,
  mimeType = "image/jpeg",
  bucketName = "koop"
) => {
  const [uploading, setuploading] = useState(false);
  const [fullPath, setFullPath] = useState(null);
  const [error, seterror] = useState(null);
  const [localURI, setLocalURI] = useState(null);

  const uploadFile = async (uri) => {
    console.error(`Uploading file : ${uri}`);

    setuploading(true);
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    console.log(`Uploading ... ${uri}`);
    const { data, error } = await supabase.storage
      .from(KOOP_BUCKET_NAME)
      .upload(remotePath, decode(base64), { contentType: mimeType });

    console.log("Profile pic uploaded!\n", data);
    if (data) {
      setFullPath(data.fullPath);
      setuploading(false);
      console.log(`Upload success! ${data.fullPath}`);
    }

    if (error) {
      seterror(error);
      setuploading(false);
      console.error(`Upload error ... ${error}`);
    }
  };

  useEffect(() => {
    if (localURI && localURI.length > 0) {
      /* const uploadFile = async (uri) => {
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        console.log(`Uploading ... ${uri}`);
        const { data, error } = await supabase.storage
          .from(KOOP_BUCKET_NAME)
          .upload(remotePath, decode(base64), { contentType: mimeType });

        console.log("Profile pic uploaded!\n", data);
        if (data) {
          setFullPath(data.fullPath);
          setuploading(false);
          console.log(`Upload success! ${data.fullPath}`);
        }

        if (error) {
          seterror(error);
          setuploading(false);
          console.error(`Upload error ... ${error}`);
        }
      }; */

      uploadFile(localURI, remotePath, mimeType, bucketName);
    } else {
      console.error(
        "useFileUpload => localURI is null, setLocalURI for upload ..."
      );
    }

    return () => {
      // Cleanup or additional logic if needed
    };
  }, [localURI]);

  return [setLocalURI, uploading, fullPath, error, uploadFile];
};

export default useFileUpload;
