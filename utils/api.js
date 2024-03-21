const API_ENDPOINT = "https://konext.vercel.app/api";

export const login = async (phone, pin) => {
  const API_LOGIN = `${API_ENDPOINT}/auth/login`;
  const loginData = { phone: phone, pin: pin };

  try {
    const response = await fetch(`${API_LOGIN}`, {
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
