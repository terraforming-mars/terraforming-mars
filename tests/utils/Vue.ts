
const Vue = require("vue");
const jsdom = require("jsdom");

const dom = new jsdom.JSDOM("<!doctype html><html><body></body></html>");
(global as any).window = dom.window;
(global as any).document = (global as any).window.document;
(global as any).navigator = (global as any).window.navigator;
// (global as any).window.navigator = navigator;
// (global as any).navigator = navigator;

Object.getOwnPropertyNames((global as any).window).forEach(function (k) {
    if (k === "undefined") {
        return;
    }
    console.log(k, typeof (global as any)[k]);
    if (typeof (global as any)[k] !== "undefined") {
        return;
    }
    if (k !== "localStorage" && k !== "sessionStorage") {
        (global as any)[k] = (global as any).window[k];
    }
});

// i(global as any).Element = (global as any).window.Element;
// (global as any).HTMLBodyElement = (global as any).window.HTMLBodyElement;

// console.log(Object.getOwnPropertyNames((global as any).window));

Vue.default = Vue;

export function setup() {
//    console.log(Vue);
//    const vue = require.resolve("vue");
//    require.cache[vue] = {
//        exports: {
//            default: {
//                component: Vue.component
//            }
//        }
//    };
}

