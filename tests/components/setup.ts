require('jsdom-global')();
const MutationObserverMock = require('mutation-observer');

// @ts-ignore
global.MutationObserver = MutationObserverMock;
