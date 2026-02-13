const BASE_URL = "http://localhost:3000";

export async function getData(endpoint) {
  const res = await fetch(`${BASE_URL}/${endpoint}`);
  if (res) return res.json();
  throw new Error("Failed to fetch");
}

export async function postData(endpoint, data) {
  const res = await fetch(`${BASE_URL}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function putData(endpoint, id, data) {
  const res = await fetch(`${BASE_URL}/${endpoint}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteData(endpoint, id) {
  const res = await fetch(`${BASE_URL}/${endpoint}/${id}`, {
    method: "DELETE",
  });
  return res.json();
}
