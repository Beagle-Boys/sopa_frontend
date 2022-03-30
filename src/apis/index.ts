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
    throw new Error("Spot Add failed " + status);
  }
  return await response.json();
}

// export async function api_spot_getall(x_sopa_key: string, data: any) {
//   let headers = new Headers();
//   headers.append("x-sopa-key", x_sopa_key);
//   headers.append("Content-Type", "application/json");
//   let request_options = {
//     method: "POST",
//     headers: headers,
//     body: JSON.stringify(data),
//   };
//   let response = await fetch(`${API_URL}/spot/add`, request_options);
//   let status = response.status;
//   if (status !== 200) {
//     throw new Error("Fetching all spots failed");
//   }
//   return await response.json();
// }

export async function api_spot_image_add(x_sopa_key: string, data: any) {
  let headers = new Headers();
  headers.append("x-sopa-key", x_sopa_key);
  headers.append("Content-Type", "application/json");
  let request_options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  };
  // console.log(data)
  // console.log("api data :", data[0]._W.slice(0, 20))
  let response = await fetch(`${API_URL}/user/spot/image/add`, request_options);
  let status = response.status;
  if (status !== 200) {
    throw new Error("Adding Images Failed! " + status);
  }
  return await response.json();
}

export async function api_user_details(x_sopa_key: string) {
  let headers = new Headers();
  headers.append("x-sopa-key", x_sopa_key);
  headers.append("Content-Type", "application/json");
  let request_options = {
    method: "GET",
    headers: headers,
  };
  let response = await fetch(`${API_URL}/user/details`, request_options);
  let status = response.status;
  if (status !== 200) {
    throw new Error("Fetching User Details failed");
  }
  return await response.json();
}

export async function api_update_user_details(x_sopa_key: string, data: any) {
  let headers = new Headers();
  headers.append("x-sopa-key", x_sopa_key);
  headers.append("Content-Type", "application/json");
  let request_options = {
    method: "PUT",
    headers: headers,
    body: JSON.stringify(data),
  };
  // console.log(data)
  // console.log("api data :", data[0]._W.slice(0, 20))
  let response = await fetch(`${API_URL}/user/details`, request_options);
  let status = response.status;
  if (status !== 200) {
    throw new Error("Updating User Details Failed! " + status);
  }
  return await response.json();
}

export async function api_spot_getall(
  x_sopa_key: string,
  data: any,
  distance: number,
  spend_karma: boolean
) {
  let headers = new Headers();
  headers.append("x-sopa-key", x_sopa_key);
  headers.append("Content-Type", "application/json");
  let request_options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  };
  // console.log("DATA FETCH ALL :");
  // console.log(data);
  let response = await fetch(
    `${API_URL}/spot/get?distance=${distance}&spend_karma=${spend_karma}`,
    request_options
  );
  let status = response.status;
  if (status !== 200) {
    response.json().then(console.log);
    throw new Error("Getting all spots Failed! " + status);
  }
  return await response.json();
}

export async function api_insert_spot_review(
  x_sopa_key: string,
  data: any,
  spot_id: string
) {
  let headers = new Headers();
  headers.append("x-sopa-key", x_sopa_key);
  headers.append("Content-Type", "application/json");
  let request_options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  };
  let response = await fetch(`${API_URL}/spot/get/${spot_id}`, request_options);
  let status = response.status;
  if (status !== 200) {
    throw new Error("Inserting Spot Review Failed! " + status);
  }
  return await response.json();
}

export async function api_get_spot_details(
  x_sopa_key: string,
  spot_id: string
) {
  console.log("fetching spots by id");
  let headers = new Headers();
  headers.append("x-sopa-key", x_sopa_key);
  headers.append("Content-Type", "application/json");
  let request_options = {
    method: "GET",
    headers: headers,
  };
  let response = await fetch(`${API_URL}/spot/get/${spot_id}`, request_options);
  let status = response.status;
  if (status !== 200) {
    throw new Error("Fetching Spot Details Failed! " + status);
  }
  return await response.json();
}

// Reservation

export async function api_create_reservation(
  x_sopa_key: string,
  data: any,
  spot_id: string
) {
  let headers = new Headers();
  headers.append("x-sopa-key", x_sopa_key);
  headers.append("Content-Type", "application/json");
  let request_options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  };
  console.log(spot_id);
  let response = await fetch(
    `${API_URL}/reservation/create/${spot_id}`,
    request_options
  );
  let status = response.status;
  if (status !== 200) {
    if (status == 400) response.json().then((res) => alert(res.detail));
    response.json().then(console.log);
    throw new Error("Creating Reservation Failed! " + status);
  }
  return await response.json();
}

export async function api_respond_reservation(x_sopa_key: string, data: any) {
  let headers = new Headers();
  headers.append("x-sopa-key", x_sopa_key);
  headers.append("Content-Type", "application/json");
  let request_options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  };
  let response = await fetch(`${API_URL}/reservation/respond`, request_options);
  let status = response.status;
  if (status !== 200) {
    throw new Error("Respond Reservaation Failed! " + status);
  }
  return await response.json();
}

export async function api_list_reservation_created(x_sopa_key: string) {
  let headers = new Headers();
  headers.append("x-sopa-key", x_sopa_key);
  headers.append("Content-Type", "application/json");
  let request_options = {
    method: "GET",
    headers: headers,
  };
  let response = await fetch(
    `${API_URL}/reservation/list/created`,
    request_options
  );
  let status = response.status;
  if (status !== 200) {
    throw new Error("Fetching Created Reservation Failed! " + status);
  }
  return await response.json();
}

export async function api_list_reservation_raised(x_sopa_key: string) {
  let headers = new Headers();
  headers.append("x-sopa-key", x_sopa_key);
  headers.append("Content-Type", "application/json");
  let request_options = {
    method: "GET",
    headers: headers,
  };
  let response = await fetch(
    `${API_URL}/reservation/list/raised`,
    request_options
  );
  let status = response.status;
  if (status !== 200) {
    throw new Error("Fetching Raised Reservation Failed! " + status);
  }
  return await response.json();
}

export async function api_search_spots(x_sopa_key: string, data: any) {
  let headers = new Headers();
  headers.append("x-sopa-key", x_sopa_key);
  // headers.append("query", data);
  headers.append("Content-Type", "application/json");
  console.log("Query Seach : " + data);
  let request_options = {
    method: "GET",
    headers: headers,
  };
  let response = await fetch(
    `${API_URL}/spot/search?query=${data}`,
    request_options
  );
  let status = response.status;
  if (status !== 200) {
    throw new Error("Search Spot Details Failed! " + status);
  }
  return await response.json();
}

export async function api_initiate_premium(x_sopa_key: string) {
  let headers = new Headers();
  headers.append("x-sopa-key", x_sopa_key);
  headers.append("Content-Type", "application/json");
  let request_options = {
    method: "POST",
    headers: headers,
  };
  let response = await fetch(
    `${API_URL}/user/premium/initiate`,
    request_options
  );
  let status = response.status;
  if (status !== 200) {
    throw new Error("Premium Initiate Failed! " + status);
  }
  return await response.json();
}

export async function api_complete_premium(x_sopa_key: string, data: any) {
  let headers = new Headers();
  headers.append("x-sopa-key", x_sopa_key);
  headers.append("Content-Type", "application/json");
  console.log(data);
  let request_options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  };
  let response = await fetch(
    `${API_URL}/user/premium/complete`,
    request_options
  );
  let status = response.status;
  if (status !== 200) {
    response.json().then(console.log);
    throw new Error("Premium Complete Failed! " + status);
  }
  return await response.json();
}
