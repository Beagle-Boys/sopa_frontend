const API_URL = "http://sopa-bff.herokuapp.com";

export async function api_register(data: any) {
  let headers = new Headers();
  headers.append("Content-Type", "application/json");
  let request_options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  };
  console.log("api_register", data, request_options);
  let response = await fetch(
    `${API_URL}/user/register/mobile`,
    request_options
  );
  let status = response.status;
  console.log("api_register", response, status);
  if (status !== 200) {
    throw new Error("Registration failed");
  }
  return await response.json();
}

export async function api_login(data: any) {
  let headers = new Headers();
  headers.append("Content-Type", "application/json");
  let request_options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  };
  let response = await fetch(`${API_URL}/user/login/mobile`, request_options);
  let status = response.status;
  if (status !== 200) {
    throw new Error("Login failed " + status);
  }
  return await response.json();
}

export async function api_validate_register(data: any) {
  let headers = new Headers();
  headers.append("Content-Type", "application/json");
  let request_options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  };
  let response = await fetch(
    `${API_URL}/user/register/otp/validate`,
    request_options
  );
  let status = response.status;
  if (status !== 200) {
    throw new Error("Registration Validation failed");
  }
  return await response.json();
}

export async function api_validate_login(data: any) {
  let headers = new Headers();
  headers.append("Content-Type", "application/json");
  let request_options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  };
  let response = await fetch(
    `${API_URL}/user/login/otp/validate`,
    request_options
  );
  // const j = await response.json();
  // console.log(data);
  // console.log(j);
  let status = response.status;
  if (status !== 200) {
    throw new Error("Login Validation failed " + status);
  }
  return await response.json();
}

export async function api_logout(x_sopa_key: string) {
  let headers = new Headers();
  headers.append("x-sopa-key", x_sopa_key);
  headers.append("Content-Type", "application/json");
  let request_options = {
    method: "POST",
    headers: headers,
  };
  let response = await fetch(`${API_URL}/user/logout`, request_options);
  let status = response.status;
  if (status !== 200) {
    throw new Error("Logout failed");
  }
  return await response.json();
}

export async function api_spot_add(x_sopa_key: string, data: any) {
  let headers = new Headers();
  headers.append("x-sopa-key", x_sopa_key);
  headers.append("Content-Type", "application/json");
  let request_options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  };
  let response = await fetch(`${API_URL}/user/spot/add`, request_options);
  let status = response.status;
  if (status !== 200) {
    throw new Error("Spot Add failed");
  }
  return await response.json();
}

export async function api_spot_getall(x_sopa_key: string, data: any) {
  let headers = new Headers();
  headers.append("x-sopa-key", x_sopa_key);
  headers.append("Content-Type", "application/json");
  let request_options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  };
  let response = await fetch(`${API_URL}/spot/add`, request_options);
  let status = response.status;
  if (status !== 200) {
    throw new Error("Fetching all spots failed");
  }
  return await response.json();
}

export async function api_spot_image_add(x_sopa_key: string, data: any) {
  let headers = new Headers();
  headers.append("x-sopa-key", x_sopa_key);
  headers.append("Content-Type", "application/json");
  let request_options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  };
  let response = await fetch(`${API_URL}/user/spot/image/add`, request_options);
  let status = response.status;
  if (status !== 200) {
    console.log(x_sopa_key);
    throw new Error("Adding Images Failed! " + status);
  }
  return await response.json();
}
