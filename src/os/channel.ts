const channel = new Map<string, { value: unknown; seq: number }>();
let seq = 0;

export function send(appId: string, payload: unknown) {
  channel.set(appId, { value: payload, seq: ++seq });
}

// Consumes and returns the most recent payload for an appId (even if a
// previous payload was already consumed). Lets already-open apps re-receive
// fresh payloads on repeated file opens.
export function takeLatest(appId: string): unknown {
  const v = channel.get(appId);
  if (v) channel.delete(appId);
  return v ? v.value : null;
}