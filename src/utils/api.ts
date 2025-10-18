export async function apiFetch(input: RequestInfo, init?: RequestInit) {
  const res = await fetch(input, init);
  const text = await res.text();
  let json: any = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch (e) {
  }

  if (!res.ok) {
    const msg = (json && (json.message || json.error)) ?? text ?? res.statusText;
    const err = new Error(String(msg || 'Network error'));
    (err as any).status = res.status;
    (err as any).body = json;
    throw err;
  }

  if (json && typeof json.ok !== 'undefined' && json.ok === false) {
    const err = new Error(String(json.message ?? 'Error'));
    (err as any).status = res.status;
    (err as any).body = json;
    throw err;
  }

  return json ?? text;
}

export default apiFetch;
