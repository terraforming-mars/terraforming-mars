import Vue from "vue";

export const LogPanel = Vue.component("log-panel", {
    props: ["messages"],
    data: function () {
        return {}
    },
    methods: {
        scrollToEnd: function() { 
            const scrollablePanel = document.getElementById("logpanel-scrollable");
            if (scrollablePanel !== null) {
                scrollablePanel.scrollTop = scrollablePanel.scrollHeight;
            }
        }    
    },
    mounted: function () {
        this.$nextTick(this.scrollToEnd);
    },
    template: `
    <div class="panel log-panel">
        <div id="logpanel-scrollable" class="panel-body">
            <ul v-if="messages">
                <li v-for="message in messages">
                    {{message}}
                </li>
            </ul>
        </div>
    </div>
    `
});