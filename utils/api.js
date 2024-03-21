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
