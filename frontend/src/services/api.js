export async function validateCode(code) {
  const response = await fetch("http://localhost:8000/validate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });
  return response.json();
}
