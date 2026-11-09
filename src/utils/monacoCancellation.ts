/** Monaco cancels background requests as the preview changes models or modes.
 * Match its cancellation type AND its source, never just a generic message.
 */
export function isMonacoCancellation(reason: unknown): boolean {
  return reason instanceof Error
    && reason.name === 'Canceled'
    && reason.message === 'Canceled'
    && typeof reason.stack === 'string'
    && /(?:\/monaco-editor(?:@[^/]+)?\/|\/vs\/editor\/editor\.main\.js)/.test(reason.stack);
}

export function handleMonacoCancellations(target: EventTarget): () => void {
  const handle = (event: Event) => {
    // This is an expected control-flow rejection, like Monaco's own
    // isCancellationError filter. Preserve all real/unrelated failures.
    if (isMonacoCancellation((event as PromiseRejectionEvent).reason)) event.preventDefault();
  };
  target.addEventListener('unhandledrejection', handle);
  return () => target.removeEventListener('unhandledrejection', handle);
}
