export interface AccessExtensionRequest {
  id: string;
  username: string;
  name: string;
  role: string;
  note?: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'declined';
}

const EXTENSION_REQUESTS_KEY = 'seakit_pmo_extension_requests_v1';

export function getExtensionRequests(): AccessExtensionRequest[] {
  try {
    const raw = localStorage.getItem(EXTENSION_REQUESTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveExtensionRequests(requests: AccessExtensionRequest[]): void {
  try {
    localStorage.setItem(EXTENSION_REQUESTS_KEY, JSON.stringify(requests));
  } catch (e) {
    console.error('Failed to save extension requests', e);
  }
}

export function submitExtensionRequest(
  username: string,
  name: string,
  role: string,
  note?: string
): AccessExtensionRequest {
  const existing = getExtensionRequests();
  const newReq: AccessExtensionRequest = {
    id: `req-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    username,
    name,
    role,
    note: note || 'Requested 72-hour review extension.',
    timestamp: new Date().toISOString(),
    status: 'pending',
  };
  existing.unshift(newReq);
  saveExtensionRequests(existing);
  return newReq;
}

export function updateExtensionRequestStatus(id: string, status: 'approved' | 'declined'): void {
  const all = getExtensionRequests();
  const updated = all.map((r) => (r.id === id ? { ...r, status } : r));
  saveExtensionRequests(updated);
}

export function clearExtensionRequests(): void {
  localStorage.removeItem(EXTENSION_REQUESTS_KEY);
}
