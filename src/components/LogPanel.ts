import Vue from "vue";

import { CardType } from "../cards/CardType";
import { LogMessage } from "../LogMessage";
import { LogMessageType } from "../LogMessageType";
import { LogMessageData } from "../LogMessageData";
import { LogMessageDataType } from "../LogMessageDataType";

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
        parseData: function(data: LogMessageData) {
            if (data.type !== undefined && data.value !== undefined) {
                if (data.type === LogMessageDataType.PLAYER) {
                    for (let player of this.players) {
                        if (data.value === player.name) {
                            return "<log-player class=\"player_bg_color_"+player.color+"\">"+data.value+"</log-player>";
                        }
                    }
                } else if (data.type === LogMessageDataType.CARD) {
                    for (let player of this.players) {
                        for (let card of player.playedCards) {
                            if (data.value === card.name && card.cardType !== undefined) {
                                if (card.cardType === CardType.EVENT) {
                                    return "<log-card class=\"background-color-events\">"+data.value+"</log-card>";
                                } else if (card.cardType === CardType.ACTIVE) {
                                    return "<log-card class=\"background-color-active\">"+data.value+"</log-card>";
                                } else if (card.cardType === CardType.AUTOMATED) {
                                    return "<log-card class=\"background-color-automated\">"+data.value+"</log-card>";
                                } else if (card.cardType === CardType.PRELUDE) {
                                    return "<log-card class=\"background-color-prelude\">"+data.value+"</log-card>";
                                } else {
                                    return data.value;
                                }
                            }
                        }
                    }
                } else  {
                    return data.value;
                }
            }
            return '';
        },
        parseMessage: function(message: LogMessage) {
            if (message.type !== undefined && message.message !== undefined) {
                return message.message.replace(/\$\{([0-9]{1})\}/gi, (_match, idx) => {
                    return this.parseData(message.data[idx]);
                });
            }
            return '';
        },
        isNewGeneration: function(type: LogMessageType) {
            return (type === LogMessageType.NEW_GENERATION);
        }
    },
    mounted: function () {
        this.$nextTick(this.scrollToEnd);
    },
    template: `
    <div class="panel log-panel">
        <div id="logpanel-scrollable" class="panel-body">
            <ul v-if="messages">
                <li v-for="message in messages" v-html="parseMessage(message)" :class="isNewGeneration(message.type) ? 'noBullet' : ''"></li>
            </ul>
        </div>
    </div>
    `
});