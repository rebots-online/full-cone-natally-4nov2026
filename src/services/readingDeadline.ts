/** A connected but silent provider must not leave a reading waiting indefinitely. */
export function createReadingDeadline(timeoutMs = 90_000) {
  const controller = new AbortController();
  let disposed = false;
  let timer: ReturnType<typeof setTimeout>;
  const progress = () => {
    if (disposed || controller.signal.aborted) return;
    clearTimeout(timer);
    timer = setTimeout(() => controller.abort(new DOMException('Reading stopped making progress', 'TimeoutError')), timeoutMs);
  };
  progress();
  return { signal: controller.signal, progress, dispose() { disposed = true; clearTimeout(timer); } };
}
