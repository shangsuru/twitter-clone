export default function api(
  endpoint: string,
  method: string,
  body?: object,
  JWT?: string
): Promise<Response> {
  if (method === "GET") {
    // GET cannot contain body
    return fetch(`${process.env.PUBLIC_API_URL}/backend/${endpoint}`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JWT}`,
      },
    });
  }

  return fetch(`${process.env.PUBLIC_API_URL}/backend/${endpoint}`, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${JWT}`,
    },
    body: JSON.stringify(body),
  });
}
