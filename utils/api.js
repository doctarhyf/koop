import { supabase, TABLE_NAMES } from "./supabase";

const API_ENDPOINT = "https://konext.vercel.app/api";

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
