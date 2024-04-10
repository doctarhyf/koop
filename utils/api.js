import { insertItem, uploadPic } from "./db";
import { supabase, TABLE_NAMES } from "./supabase";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";

const TESTING = true;
const API_ENDPOINT = TESTING
  ? ' "https://localhost:3000/api'
  : "https://konext.vercel.app/api";

export const login = async (phone, pin) => {
  const API_LOGIN = `${API_ENDPOINT}/auth/login`;
  const loginData = { phone: phone, pin: pin };
  let errorMessage = null;

  try {
    const response = await fetch(`${API_LOGIN}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      errorMessage = "Network response was not ok";
      throw new Error(errorMessage);
    }

    data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    // Handle errors
    errorMessage = `There was a problem with the fetch operation: ${JSON.stringify(
      error
    )}`;
    console.error(errorMessage);
    return { error: true, message: errorMessage };
  }

  return API_LOGIN;
};

export const addViewsCount = async (user_id, item_id) => {
  try {
    let data = { user_id: user_id, item_id: item_id };
    const response = await fetch(`${API_ENDPOINT}/items/addviewscount`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      errorMessage = "Network response was not ok";
      throw new Error(errorMessage);
    }

    data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    // Handle errors
    errorMessage = `There was a problem with the fetch operation: ${JSON.stringify(
      error
    )}`;
    console.error(errorMessage);
    return { error: true, message: errorMessage };
  }
};

export const likeItem = async (user_id, item_id) => {
  try {
    let data = { user_id: user_id, item_id: item_id };
    const response = await fetch(`${API_ENDPOINT}/items/likeitem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      errorMessage = "Network response was not ok";
      throw new Error(errorMessage);
    }

    data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    // Handle errors
    errorMessage = `There was a problem with the fetch operation: ${JSON.stringify(
      error
    )}`;
    console.error(errorMessage);
    return { error: true, message: errorMessage };
  }
};

export const sendMessage = async (message) => {
  /*message object 
from_id ,
to_id ,
content */

  try {
    const response = await fetch(`${API_ENDPOINT}/messages/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message), //nouveau design
    });

    if (!response.ok) {
      errorMessage = "Network response was not ok";
      throw new Error(errorMessage);
    }

    message = await response.json();
    console.log(message);
    return message;
  } catch (error) {
    // Handle errors
    errorMessage = `There was a problem with the fetch operation: ${JSON.stringify(
      error
    )}`;
    console.error(errorMessage);
    return { error: true, message: errorMessage };
  }
};

export async function insertServiceRequest(user, itemData) {
  const { images, user_id, label, desc } = itemData;
  const promises_file_read = [];

  if (images.length > 0) {
    const promises = [];

    //console.log("images => ", servdata.photos);
    // Upload the same image 4 times for demonstration purposes
    for (let i = 0; i < images.length; i++) {
      //console.error(images[i]);
      const imagePath = `user_${
        user.phone
      }/item_${i}_${new Date().getTime()}.jpg`;
      const fileData = await FileSystem.readAsStringAsync(images[i], {
        encoding: FileSystem.EncodingType.Base64,
      });

      promises.push(
        supabase.storage.from("koop").upload(imagePath, decode(fileData), {
          cacheControl: "3600",
          contentType: "image/jpeg",
        })
      );
    }

    // Wait for all uploads to complete
    const results = await Promise.all(promises);
    const imagesPaths = [];
    results.forEach((it, i) => imagesPaths.push(it.data.fullPath));

    console.error(imagesPaths);
    itemData.images = imagesPaths;
  }

  try {
    const response = await fetch(`${API_ENDPOINT}/sreq/post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(itemData), //nouveau design
    });

    if (!response.ok) {
      errorMessage = "Network response was not ok";
      throw new Error(errorMessage);
    }

    message = await response.json();
    console.log(message);
    return message;
  } catch (error) {
    // Handle errors
    errorMessage = `There was a problem with the fetch operation: ${JSON.stringify(
      error
    )}`;
    console.error(errorMessage);
    return { error: true, message: errorMessage };
  }
}
