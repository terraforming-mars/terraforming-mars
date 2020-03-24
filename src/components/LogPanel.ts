import Vue from "vue";

import { CardType } from "../cards/CardType";

export const LogPanel = Vue.component("log-panel", {
    props: ["messages", "players"],
    data: function () {
        return {}
    },
    methods: {
        scrollToEnd: function() { 
            const scrollablePanel = document.getElementById("logpanel-scrollable");
            if (scrollablePanel !== null) {
                scrollablePanel.scrollTop = scrollablePanel.scrollHeight;
            }
        },
        parseMessage: function(message: string) {
            let parsed = document.createElement("div");
            parsed.innerHTML = message;

            // Parse <log-player> tags
            const domPlayers = parsed.getElementsByTagName("log-player");
            for (let i = 0; i < domPlayers.length; i++) {
                if (domPlayers[i].getAttribute("name") !== undefined) {
                    for (let player of this.players) {
                        if (domPlayers[i].getAttribute("name") === player.name) {
                            domPlayers[i].classList.add("player_color_"+player.color);
                            break;
                        }
                    }
                }
            }

            // Parse <log-card> tags
            const domCards = parsed.getElementsByTagName("log-card");
            for (let i = 0; i < domCards.length; i++) {
                if (domCards[i].getAttribute("name") !== undefined) {
                    for (let player of this.players) {
                        for (let card of player.playedCards) {
                            if (domCards[i].getAttribute("name") === card.name && card.cardType !== undefined) {
                                switch (card.cardType) {
                                    case CardType.EVENT:
                                        domCards[i].classList.add("background-color-events");
                                        break;
                                    case CardType.ACTIVE:
                                        domCards[i].classList.add("background-color-active");
                                        break;
                                    case CardType.AUTOMATED:
                                        domCards[i].classList.add("background-color-automated");
                                        break;
                                    case CardType.PRELUDE:
                                        domCards[i].classList.add("background-color-prelude");
                                        break;
                                }
                            }
                        }
                    }
                }
            }

            return parsed.innerHTML;
        },
        hasGenerationTag: function(message: string) {
            let parsed = document.createElement("div");
            parsed.innerHTML = message;

            const domGeneration = parsed.getElementsByTagName("log-generation");
            if (domGeneration[0] !== undefined) {
                return true;
            }

            return false;
        }
    },
    mounted: function () {
        this.$nextTick(this.scrollToEnd);
    },
    template: `
    <div class="panel log-panel">
        <div id="logpanel-scrollable" class="panel-body">
            <ul v-if="messages">
                <li v-for="message in messages" v-html="parseMessage(message)" :class="hasGenerationTag(message) ? 'noBullet' : ''"></li>
            </ul>
        </div>
    </div>
    `
});