require('jsdom-global')();
const MutationObserverMock = require('mutation-observer');

// @ts-ignore
global.MutationObserver = MutationObserverMock;

Object.defineProperty(window, 'location', {
  writable: true,
  value: {
    ...window.location,
    reload: () => {},
  },
});
