import {disableAutoUnmount, enableAutoUnmount} from '@vue/test-utils';

// The suite runs with `isolate: false`, so the jsdom environment outlives each
// spec file. Unmounting every wrapper stops one spec's teardown from leaking
// timers, listeners or detached nodes into the next.
//
// This file re-runs per spec file, but test-utils keeps `isEnabled` in module
// state that the shared environment preserves, so enabling twice throws without
// the reset.
disableAutoUnmount();
enableAutoUnmount(afterEach);
