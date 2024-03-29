import * as FileSystem from "expo-file-system";
import { getPublicUrl } from "../utils/db";
import { supabase } from "../utils/supabase";
import { decode } from "base64-arraybuffer";

export const GetRandomImages = async (count, width, height) => {
  const accessKey = process.env.EXPO_PUBLIC_UNSPLASH_ACCESS_KEY; // Replace with your Unsplash access key
  const apiUrl = `https://api.unsplash.com/photos/random?client_id=${accessKey}&count=${count}&width=${width}&height=${height}&query=tech`;

  /* console.log("Access Key: ", accessKey);
  console.log("apiURL: ", apiUrl); */

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching images:", error);
    return [];
  }
};

export const ReadFile = async (filePath, base64 = false) => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(filePath);

    console.log("fileInfo => ", fileInfo);

    if (fileInfo.exists) {
      // let content = await FileSystem.readAsStringAsync(filePath);

      // if (base64) {
      content = await FileSystem.readAsStringAsync(filePath, {
        encoding: FileSystem.EncodingType.Base64,
      });
      //  }

      return content;
    } else {
      console.log("File does not exist.");

      return { error: "File does not exist." };
    }
  } catch (error) {
    console.error("Error reading file:", error);
    return { error: "Error reading file" };
  }
};

export const PickImageAndConvertToBase64 = async () => {
  try {
    // Step 1: Request permission to access the device's image gallery
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      console.error("Permission to access image gallery denied");
      return;
    }

    // Step 2: Pick an image from the gallery
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3], // Adjust the aspect ratio as needed
      quality: 1,
    });

    if (result.cancelled) {
      console.log("Image picking canceled");
      return;
    }

    // Step 3: Check if the file URI is available
    if (!result.uri) {
      console.error("Image URI not available");
      return;
    }

    // Step 4: Read the image file and convert it to base64
    const imageUri = result.uri;
    const fileInfo = await FileSystem.getInfoAsync(imageUri);

    if (!fileInfo.exists) {
      console.error("Image file not found");
      return;
    }

    const fileContent = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    console.log("Base64 Content:", fileContent);
    // Do something with the base64 content, e.g., send it to a server
  } catch (error) {
    console.error("Error:", error);
  }
};

export function GetMMSS(secs) {
  const minutes = Math.floor(secs / 60);
  const seconds = secs % 60;

  // Pad single-digit seconds with a leading zero
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  return `${minutes}:${formattedSeconds}`;
}

export async function SBFileUpload(
  localUri,
  serverpath,
  mimeType = "image/jpg"
) {
  const uri = localUri;
  const filePath = serverpath; // const filePath = `user_${phone}/profile_${new Date().getTime()}.jpg`;
  const contentType = mimeType; // const contentType = "image/jpg";

  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  //const filePath = `user_${phone}/profile_${new Date().getTime()}.jpg`;
  // const contentType = "image/jpg";

  const { data, error } = await supabase.storage
    .from("koop")
    .upload(filePath, decode(base64), { contentType });

  console.log("Profile pic uploaded! data => ", data);
  if (data !== null && data.fullPath) {
    const publicURL = await getPublicUrl(data.fullPath.replace("koop/", ""));
    //console.error("real path => ", publicURL);
    //newUserData.profile = publicURL;
    return publicURL;
  }

  return null;
}
