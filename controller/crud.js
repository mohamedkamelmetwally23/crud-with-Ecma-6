const url = "http://localhost:3000";
export function getData(endpoint) {
  return fetch(`${url}/${endpoint}`).then((res) => res.json());
}
export function postData(endpoint, data) {
  return fetch(`${url}/${endpoint}`, {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((res) => res.json());
}
export function deleteData(endpoint, id) {
  return fetch(`${url}/${endpoint}/${id}`, {
    method: "DELETE",
  }).then((res) => res.json());
}
export function putData(endpoint, id, data) {
  return fetch(`${url}/${endpoint}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((res) => res.json());
}
