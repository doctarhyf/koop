import { insertItem, uploadPic } from "./db";
import { supabase, TABLE_NAMES } from "./supabase";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";
import { SBFileUpload } from "../helpers/funcs";

const TESTING = false;
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
  let errorMessage = null;

  if (images.length > 0) {
    const promises = [];

    for (let i = 0; i < images.length; i++) {
      const imageLocalURI = images[i];
      const imageServerPath = `user_${
        user.phone
      }/item_${i}_${new Date().getTime()}.jpg`;
      const fileData = await FileSystem.readAsStringAsync(images[i], {
        encoding: FileSystem.EncodingType.Base64,
      });

      promises.push(SBFileUpload(imageLocalURI, imageServerPath));
    }

    const results = await Promise.all(promises);
    itemData.images = results;
  }

  try {
    const response = await fetch(`${API_ENDPOINT}/sreq/send`, {
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

    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    // Handle errors
    errorMessage = `There was a problem with the fetch operation: ${JSON.stringify(
      error
    )}`;
    console.error(errorMessage);
    return { error: true, message: errorMessage };
  }
}

export async function deleteItem(tableName, rowName, rowVal) {
  let res = supabase.from(tableName).delete().eq(rowName, rowVal);
  console.error(
    `deleting item from ${tableName} where ${rowName} === ${rowVal}`
  );
  return res;
}
