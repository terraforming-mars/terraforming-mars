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
    ALL_VENUS_CORPORATIONS,
    ALL_VENUS_PROJECTS_CARDS,
    ALL_COLONIES_CORPORATIONS,
    ALL_COLONIES_PROJECTS_CARDS,
    ALL_TURMOIL_CORPORATIONS,
    ALL_TURMOIL_PROJECTS_CARDS,
    ALL_PROMO_CORPORATIONS,
    ALL_PROMO_PROJECTS_CARDS,
    ALL_COMMUNITY_CORPORATIONS,
} from "../Dealer";
import { HTML_DATA } from "../HTML_data";
import { CardModel } from "../models/CardModel";
import { CardTitle } from "./card/CardTitle";
import { CardResourceCounter } from "./card/CardResourceCounter";
import { CorporationGroup } from "../CorporationName";
import { CardCost } from "./card/CardCost";
import { CardExtraContent } from "./card/CardExtraContent";
import { CardExpansion } from "./card/CardExpansion";
import { CardTags } from "./card/CardTags";
import { CardType } from "../cards/CardType";

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
    cardFactory = ALL_COLONIES_CORPORATIONS.find(
        (cardFactory) => cardFactory.cardName === cardName
    );
    if (cardFactory !== undefined) {
        return new cardFactory.factory();
    }
    cardFactory = ALL_TURMOIL_CORPORATIONS.find(
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

export function getCardExtensionByName(cardName: string): string {
    //promo
    if (ALL_CORP_ERA_PROJECT_CARDS.find((c) => c.cardName === cardName))
        return "corporation";
    if (ALL_CORP_ERA_CORPORATION_CARDS.find((c) => c.cardName === cardName))
        return "corporation";
    //prelude
    if (ALL_PRELUDE_CORPORATIONS.find((c) => c.cardName === cardName))
        return CorporationGroup.PRELUDE;
    if (ALL_PRELUDE_CARDS.find((c) => c.cardName === cardName))
        return CorporationGroup.PRELUDE;
    //venus
    if (ALL_VENUS_CORPORATIONS.find((c) => c.cardName === cardName))
        return CorporationGroup.VENUS_NEXT;
    if (ALL_VENUS_PROJECTS_CARDS.find((c) => c.cardName === cardName))
        return CorporationGroup.VENUS_NEXT;
    //colonies
    if (ALL_COLONIES_CORPORATIONS.find((c) => c.cardName === cardName))
        return CorporationGroup.COLONIES;
    if (ALL_COLONIES_PROJECTS_CARDS.find((c) => c.cardName === cardName))
        return CorporationGroup.COLONIES;
    //turmoil
    if (ALL_TURMOIL_CORPORATIONS.find((c) => c.cardName === cardName))
        return CorporationGroup.TURMOIL;
    if (ALL_TURMOIL_PROJECTS_CARDS.find((c) => c.cardName === cardName))
        return CorporationGroup.TURMOIL;
    //promo
    if (ALL_PROMO_CORPORATIONS.find((c) => c.cardName === cardName))
        return CorporationGroup.PROMO;
    if (ALL_PROMO_PROJECTS_CARDS.find((c) => c.cardName === cardName))
        return CorporationGroup.PROMO;
    //community
    if (ALL_COMMUNITY_CORPORATIONS.find((c) => c.cardName === cardName))
        return CorporationGroup.COMMUNITY;

    return CorporationGroup.ORIGINAL;
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
        CardCost,
        CardExtraContent,
        CardExpansion,
        CardTags,
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
        getCardExpansion: function (): string {
            if (this.card.name === "AI Central") {
                console.log(getCardExtensionByName(this.card.name));
            }
            return getCardExtensionByName(this.card.name);
        },
        getCard: function (): ICard | undefined {
            return (
                getProjectCardByName(this.card.name) ||
                getCorporationCardByName(this.card.name)
            );
        },
        getTags: function (): Array<String> | undefined {
            return this.getCard()?.tags;
        },
        getCost: function (): number {
            return this.getCard()?.cost || 0;
        },
        getCardType: function (): CardType | undefined {
            return this.getCard()?.cardType;
        },
        getCardClasses: function (card: CardModel): string {
            const classes = ["card-container", "filterDiv"];
            classes.push("card-" + card.name.toLowerCase().replace(/ /g, "-"));

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
        // console.log(this.card);
        // console.log(this.getCard());
        // console.log(this.getTags(), "TAGS");
    },
    template: `
        <div :class="getCardClasses(card)">
            <div class="card-content-wrapper" v-i18n>
                <div class="card-cost-and-tags">
                    <CardCost v-if="getCost() > 0" :amount="getCost()" />
                    <CardTags :tags="getTags()" />
                </div>
                <CardTitle :title="card.name" :type="getCardType()"/>
                <CardExpansion :expansion="getCardExpansion()" />
                <div class="content" v-html=this.getCardContent() />
            </div>
            <CardResourceCounter v-if="card.resources !== undefined" :amount="getResourceAmount(card)" />
            <CardExtraContent :card="card" />
        </div>
    `,
});
