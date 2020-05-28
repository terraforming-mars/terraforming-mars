import Vue from "vue";

import { CardType } from "../cards/CardType";
import { LogMessage } from "../LogMessage";
import { LogMessageType } from "../LogMessageType";
import { LogMessageData } from "../LogMessageData";
import { LogMessageDataType } from "../LogMessageDataType";
import { Card } from "./Card";
import { $t } from "../directives/i18n";

export const LogPanel = Vue.component("log-panel", {
    props: ["messages", "players"],
    data: function () {
        return {
            cards: new Array<string>(),
        }
    },
    components: {
        "card": Card,
    },
    methods: {
        scrollToEnd: function() { 
            const scrollablePanel = document.getElementById("logpanel-scrollable");
            if (scrollablePanel !== null) {
                scrollablePanel.scrollTop = scrollablePanel.scrollHeight;
            }
        },
        parseCardType: function(cardType: CardType, cardName: string) {
            if (cardType === CardType.EVENT) {
                return "<log-card class=\"background-color-events\">"+cardName+"</log-card>";
            } else if (cardType === CardType.ACTIVE) {
                return "<log-card class=\"background-color-active\">"+cardName+"</log-card>";
            } else if (cardType === CardType.AUTOMATED) {
                return "<log-card class=\"background-color-automated\">"+cardName+"</log-card>";
            } else if (cardType === CardType.PRELUDE) {
                return "<log-card class=\"background-color-prelude\">"+cardName+"</log-card>";
            } else {
                return cardName;
            }
        },
        parseData: function(data: LogMessageData) {
            const translatableMessageDataTypes = [
                LogMessageDataType.STANDART_PROJECT,
                LogMessageDataType.MILESTONE,
                LogMessageDataType.AWARD
            ];
            if (data.type !== undefined && data.value !== undefined) {
                if (data.type === LogMessageDataType.PLAYER) {
                    for (let player of this.players) {
                        if (data.value === player.id) {
                            return "<log-player class=\"player_bg_color_"+player.color+"\">"+player.name+"</log-player>";
                        }
                    }
                } else if (data.type === LogMessageDataType.CARD) {
                    for (let player of this.players) {
                        if (player.corporationCard !== undefined && data.value === player.corporationCard) {
                            return "<log-card class=\"background-color-corporation\">"+data.value+"</log-card>";
                        } else if (player.selfReplicatingRobotsCardTarget !== undefined && data.value === player.selfReplicatingRobotsCardTarget.name) {
                            return this.parseCardType(player.selfReplicatingRobotsCardTarget.cardType, data.value);
                        } else {
                            for (let card of player.playedCards) {
                                if (data.value === card.name && card.cardType !== undefined) {
                                    return this.parseCardType(card.cardType, data.value);
                                }
                            }
                        }
                    }
                } else if (translatableMessageDataTypes.includes(data.type)) {
                    return $t(data.value);
                } else  {
                    return data.value;
                }
            }
            return '';
        },
        parseMessage: function(message: LogMessage) {
            if (message.type !== undefined && message.message !== undefined) {
                message.message = $t(message.message);
                return message.message.replace(/\$\{([0-9]{1})\}/gi, (_match, idx) => {
                    return this.parseData(message.data[idx]);
                });
            }
            return '';
        },
        isNewGeneration: function(type: LogMessageType) {
            return (type === LogMessageType.NEW_GENERATION);
        },
        cardClicked: function (message: LogMessage) {
            let datas = message.data;
            datas.forEach((data: LogMessageData) => {
                if (data.type !== undefined && data.value !== undefined) {
                    if (data.type === LogMessageDataType.CARD) {
                        let card_name = data.value;    
                        if (!this.cards.includes(card_name)) {
                            this.cards.push(card_name);
                        }
                    }
                }
            });
        },
        hideMe: function () {
            this.cards = new Array<string>();
        },
    },
    mounted: function () {
        this.$nextTick(this.scrollToEnd);
    },
    template: `
    <div>
        <div class="panel log-panel">
            <div id="logpanel-scrollable" class="panel-body">
                <ul v-if="messages">
                    <li v-for="message in messages" v-on:click.prevent="cardClicked(message)" v-html="parseMessage(message)" :class="isNewGeneration(message.type) ? 'noBullet' : ''"></li>
                </ul>
            </div>
        </div>
        <div class="card-panel" v-if="cards.length > 0">
            <button class="btn btn-sm btn-error other_player_close" v-on:click="hideMe()"><i class="icon icon-cross"></i></button>
            <div id="log_panel_card" class="cardbox" v-for="(card, index) in cards" :key="index">
                <card :card="card"></card>
            </div>
        </div>
    </div>
    `
});
