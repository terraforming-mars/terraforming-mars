
/**
 * The vue unit test tool requires a virtual DOM to run within.
 * This script sets up that virtual DOM
 */
const jsdom = require('jsdom');
import {Database} from '../../src/database/Database';
import {IDatabase} from '../../src/database/IDatabase';

const dom = new jsdom.JSDOM('<!doctype html><html><body></body></html>');

// Attach major properties to global to mimic browser
(global as any).window = dom.window;
(global as any).document = (global as any).window.document;
(global as any).navigator = (global as any).window.navigator;

// Attach subsequent properties to global
Object.getOwnPropertyNames((global as any).window).forEach(function(k) {
  // don't override a property which exists
  if (global.hasOwnProperty(k) === true) {
    return;
  }
  if (k === 'localStorage' || k === 'sessionStorage') {
    return;
  }
  (global as any)[k] = (global as any).window[k];
});

const Vue = require('vue');

// setup for default exports
Vue.default = Vue;

// don't save to database during tests
Database.getInstance = function() {
  return {
    cleanSaves: () => {},
    deleteGameNbrSaves: () => {},
    getClonableGames: () => {},
    getGame: () => {},
    getGameVersion: () => {},
    getGames: () => {},
    restoreGame: () => {},
    loadCloneableGame: () => {},
    saveGameResults: () => {},
    saveGame: () => {},
    purgeUnfinishedGames: () => {},
  } as IDatabase;
};

