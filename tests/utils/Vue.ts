
export function setup() {
    const vue = require.resolve("vue");
    require.cache[vue] = {
        exports: {
            default: {
                component: function () {
                    return arguments[1];
                }
            }
        }
    };
}

