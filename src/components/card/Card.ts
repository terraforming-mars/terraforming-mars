import Vue from "vue";

import { IProjectCard } from "../../cards/IProjectCard";
import { ICard } from "../../cards/ICard";
import { BeginnerCorporation } from "../../cards/corporation/BeginnerCorporation";
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
    ALL_COMMUNITY_PRELUDE_CARDS,
    ALL_COMMUNITY_VENUS_PRELUDE_CARDS,
    ALL_COMMUNITY_COLONY_PRELUDE_CARDS,
    ALL_COMMUNITY_TURMOIL_PRELUDE_CARDS,
} from "../../Dealer";
import { HTML_DATA } from "../../HTML_data";
import { CardModel } from "../../models/CardModel";
import { CardTitle } from "./CardTitle";
import { CardResourceCounter } from "./CardResourceCounter";
import { CorporationGroup } from "../../CorporationName";
import { CardCost } from "./CardCost";
import { CardExtraContent } from "./CardExtraContent";
import { CardExpansion } from "./CardExpansion";
import { CardTags } from "./CardTags";
import { CardType } from "../../cards/CardType";

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
    cardFactory = ALL_COMMUNITY_PRELUDE_CARDS.find(
        (cf) => cf.cardName === cardName
    );
    if (cardFactory !== undefined) {
        return new cardFactory.factory();
    }
    cardFactory = ALL_COMMUNITY_VENUS_PRELUDE_CARDS.find(
        (cf) => cf.cardName === cardName
    );
    if (cardFactory !== undefined) {
        return new cardFactory.factory();
    }
    cardFactory = ALL_COMMUNITY_COLONY_PRELUDE_CARDS.find(
        (cf) => cf.cardName === cardName
    );
    if (cardFactory !== undefined) {
        return new cardFactory.factory();
    }
    cardFactory = ALL_COMMUNITY_TURMOIL_PRELUDE_CARDS.find(
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

export function getCardExpansionByName(cardName: string): string {
    //promo
    if (ALL_CORP_ERA_PROJECT_CARDS.find((c) => c.cardName === cardName))
        return CorporationGroup.CORPORATION;
    if (ALL_CORP_ERA_CORPORATION_CARDS.find((c) => c.cardName === cardName))
        return CorporationGroup.CORPORATION;
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
            return getCardExpansionByName(this.card.name);
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
        getCost: function (): number | undefined {
            const cost = this.getCard()?.cost;
            const type = this.getCardType();
            return cost === undefined || type === CardType.PRELUDE
                ? undefined
                : cost;
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
        isCorporationCard: function (): boolean {
            return getCorporationCardByName(this.card.name) !== undefined;
        },
    },
    template: `
        <div :class="getCardClasses(card)">
            <div class="card-content-wrapper" v-i18n>
                <div class="card-cost-and-tags">
                    <CardCost :amount="getCost()" />
                    <CardTags :tags="getTags()" />
                </div>
                <CardTitle :title="card.name" :type="getCardType()"/>
                <div class="temporary-content-wrapper" v-html=this.getCardContent() />
            </div>
            <CardExpansion v-if="!isCorporationCard()" :expansion="getCardExpansion()" />
            <CardResourceCounter v-if="card.resources !== undefined" :amount="getResourceAmount(card)" />
            <CardExtraContent :card="card" />
        </div>
    `,
});
