import Vue from "vue";

export const LogPanel = Vue.component("log-panel", {
    props: ["messages"],
    data: function () {
        return {}
    },
    methods: {
        scrollToEnd: function() { 
            const scrollablePanel = document.getElementById("logpanel");
            if (scrollablePanel !== null) {
                scrollablePanel.scrollTop = scrollablePanel.scrollHeight;
            }
        }    
    },
    mounted: function () {
        this.scrollToEnd();
    },
    template: `
    <div id="logpanel" class="panel custom-panel">
        <div class="panel-body">
            <div v-for="message in messages">
                {{message}}
            </div>
        </div>
    </div>
    `
});