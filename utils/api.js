const LOCAL_MODE = true;

const API_ENDPOINT = LOCAL_MODE
  ? "http://localhost:3000/api"
  : "https://konext.vercel.app/api";

export const getUser = async (phone, pin) => {
  const API_LOGIN = `${API_ENDPOINT}/auth/login`;
  const loginData = { phone, pin };

  try {
    const response = await fetch(`${API_LOGIN}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    // Handle the data received from the server
    console.log(data);
  } catch (error) {
    // Handle errors
    console.error("There was a problem with the fetch operation:", error);
  }

  return API_LOGIN;
};
