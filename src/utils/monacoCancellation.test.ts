import { describe, it, expect } from 'vitest';
import { isMonacoCancellation, handleMonacoCancellations } from './monacoCancellation';

function cancellation(stack = 'at https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs/editor/editor.main.js:1:100') {
  return Object.assign(new Error('Canceled'), { name: 'Canceled', stack });
}
function rejection(reason: unknown) {
  return Object.assign(new Event('unhandledrejection', {cancelable:true}), {reason});
}
describe('Monaco cancellation handling', () => {
  it('recognizes Monaco cancellations from the CDN and local module sources', () => {
    expect(isMonacoCancellation(cancellation())).toBe(true);
    expect(isMonacoCancellation(cancellation('at /node_modules/monaco-editor/esm/vs/base/common/errors.js:1'))).toBe(true);
  });
  it('does not hide real Monaco failures or unrelated cancellations', () => {
    for (const reason of [null, 'Canceled', {name:'Canceled', message:'Canceled'},
      new Error('Canceled'), cancellation('at https://example.com/app.js:1'),
      Object.assign(cancellation(), {message:'Model is disposed'}),
      Object.assign(cancellation(), {stack:undefined})]) {
      expect(isMonacoCancellation(reason)).toBe(false);
    }
  });
  it('handles only expected cancellations and removes the listener on cleanup', () => {
    const target = new EventTarget();
    const cleanup = handleMonacoCancellations(target);
    const expected = rejection(cancellation());
    target.dispatchEvent(expected);
    expect(expected.defaultPrevented).toBe(true);
    const unexpected = rejection(new Error('Real preview error'));
    target.dispatchEvent(unexpected);
    expect(unexpected.defaultPrevented).toBe(false);
    cleanup();
    const afterCleanup = rejection(cancellation());
    target.dispatchEvent(afterCleanup);
    expect(afterCleanup.defaultPrevented).toBe(false);
  });
});
