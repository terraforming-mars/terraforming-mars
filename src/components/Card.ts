import Vue from "vue";

import { IProjectCard } from "../cards/IProjectCard";
import { ICard } from "../cards/ICard";
import { BeginnerCorporation } from "../cards/corporation/BeginnerCorporation";
import {
    ALL_PRELUDE_CORPORATIONS,
    ALL_CORPORATION_CARDS,
    ALL_CORP_ERA_CORPORATION_CARDS,
    ALL_PROJECT_CARDS,
    ALL_CORP_ERA_PROJECT_CARDS,
    ALL_PRELUDE_CARDS,
    ALL_PRELUDE_PROJECTS_CARDS,
    ALL_PROMO_CORPORATIONS,
    ALL_VENUS_CORPORATIONS,
    ALL_VENUS_PROJECTS_CARDS,
    ALL_COLONIES_PROJECTS_CARDS,
    ALL_TURMOIL_PROJECTS_CARDS,
    ALL_PROMO_PROJECTS_CARDS,
    ALL_COMMUNITY_CORPORATIONS,
} from "../Dealer";
import { HTML_DATA } from "../HTML_data";
import { CardModel } from "../models/CardModel";
import { CardTitle } from "./card/CardTitle";
import { CardResourceCounter } from "./card/CardResourceCounter";

function getCorporationCardByName(cardName: string): ICard | undefined {
    if (cardName === new BeginnerCorporation().name) {
        return new BeginnerCorporation();
    }
    let cardFactory = ALL_CORPORATION_CARDS.find(
        (cardFactory) => cardFactory.cardName === cardName
    );
    if (cardFactory !== undefined) {
        return new cardFactory.factory();
    }
    cardFactory = ALL_CORP_ERA_CORPORATION_CARDS.find(
        (cardFactory) => cardFactory.cardName === cardName
    );
    if (cardFactory !== undefined) {
        return new cardFactory.factory();
    }
    cardFactory = ALL_PRELUDE_CORPORATIONS.find(
        (cardFactory) => cardFactory.cardName === cardName
    );
    if (cardFactory !== undefined) {
        return new cardFactory.factory();
    }
    cardFactory = ALL_VENUS_CORPORATIONS.find(
        (cardFactory) => cardFactory.cardName === cardName
    );
    if (cardFactory !== undefined) {
        return new cardFactory.factory();
    }
    cardFactory = ALL_PROMO_CORPORATIONS.find(
        (cardFactory) => cardFactory.cardName === cardName
    );
    if (cardFactory !== undefined) {
        return new cardFactory.factory();
    }
    cardFactory = ALL_COMMUNITY_CORPORATIONS.find(
        (cardFactory) => cardFactory.cardName === cardName
    );
    if (cardFactory !== undefined) {
        return new cardFactory.factory();
    }
    return undefined;
}

export function getProjectCardByName(
    cardName: string
): IProjectCard | undefined {
    let cardFactory = ALL_PRELUDE_CARDS.find(
        (cardFactory) => cardFactory.cardName === cardName
    );
    if (cardFactory !== undefined) {
        return new cardFactory.factory();
    }
    cardFactory = ALL_PRELUDE_PROJECTS_CARDS.find(
        (cf) => cf.cardName === cardName
    );
    if (cardFactory !== undefined) {
        return new cardFactory.factory();
    }
    cardFactory = ALL_VENUS_PROJECTS_CARDS.find(
        (cf) => cf.cardName === cardName
    );
    if (cardFactory !== undefined) {
        return new cardFactory.factory();
    }
    cardFactory = ALL_COLONIES_PROJECTS_CARDS.find(
        (cf) => cf.cardName === cardName
    );
    if (cardFactory !== undefined) {
        return new cardFactory.factory();
    }
    cardFactory = ALL_PROJECT_CARDS.find((cf) => cf.cardName === cardName);
    if (cardFactory !== undefined) {
        return new cardFactory.factory();
    }
    cardFactory = ALL_CORP_ERA_PROJECT_CARDS.find(
        (cf) => cf.cardName === cardName
    );
    if (cardFactory !== undefined) {
        return new cardFactory.factory();
    }
    cardFactory = ALL_TURMOIL_PROJECTS_CARDS.find(
        (cf) => cf.cardName === cardName
    );
    if (cardFactory !== undefined) {
        return new cardFactory.factory();
    }
    cardFactory = ALL_PROMO_PROJECTS_CARDS.find(
        (cf) => cf.cardName === cardName
    );
    if (cardFactory !== undefined) {
        return new cardFactory.factory();
    }
    return undefined;
}

function getCardContent(cardName: string): string {
    let htmlData: string | undefined = "";
    htmlData = HTML_DATA.get(cardName);
    return htmlData || "";
}

export const Card = Vue.component("card", {
    components: {
        CardTitle,
        CardResourceCounter,
    },
    props: {
        "card": {
            type: Object as () => ICard,
            required: true,
        },
        "actionUsed": {
            type: Function,
        },
    },
    methods: {
        getCardContent: function () {
            return getCardContent(this.card.name);
        },
        getCard: function () {
            return (
                getProjectCardByName(this.card.name) ||
                getCorporationCardByName(this.card.name)
            );
        },
        getTags: function (): Array<String> | undefined {
            return this.getCard()?.tags;
        },
        getCardClasses: function (card: CardModel): string {
            const classes = ["filterDiv"];
            classes.push(`card-${card.name.toLowerCase().replace(/ /g, "-")}`);

            if (this.actionUsed) {
                classes.push("cards-action-was-used");
            }
            return classes.join(" ");
        },
        getResourceAmount: function (card: CardModel): number {
            return card.resources !== undefined ? card.resources : 0;
        },
    },
    mounted: function () {
        console.log(this.card);
        console.log(this.getTags(), "TAGS");
    },
    template: `
        <div :class="getCardClasses(card)">
            <div class="card-content-wrapper" v-i18n>
                <CardTitle :title="card.name" :type="card.cardType"/>
                <CardTags :tags="getTags()" />
                <div class="content" v-html=this.getCardContent() />
            </div>
            <CardResourceCounter v-if="card.resources !== undefined" :amount="getResourceAmount(card)" />
            <CardExtraContent :card="card" />
        </div>
    `,
});
