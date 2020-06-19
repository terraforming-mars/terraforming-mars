import Vue from "vue";

export const Donate = Vue.component("donate", {
    template: `
        <div class="start-screen">
            <h1></h1>
            <div class="start-screen-links">
                本站服务器运营维护需要一些费用，您的支持是本站继续开发维护的动力，欢迎通过以下二维码捐助，金额不限，非常感激^_^
                <br><br> 
                <img src="assets/donate.jpg " style="width: 100%;" />
            </div>
        </div>
    `
});