import Vue from "vue";

import { IProjectCard } from "../../cards/IProjectCard";
import { ICard } from "../../cards/ICard";
import { BeginnerCorporation } from "../../cards/corporation/BeginnerCorporation";
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
import {
    ALL_CARD_MANIFESTS,
    ALL_CORPORATION_DECKS,
    ALL_PRELUDE_DECKS,
    ALL_PROJECT_DECKS,
} from "../../cards/AllCards";
import { Deck, Decks } from "../../Deck";
import { GameModule } from "../../GameModule";

function getCorporationCardByName(cardName: string): ICard | undefined {
    if (cardName === new BeginnerCorporation().name) {
        return new BeginnerCorporation();
    }
    return Decks.findByName(ALL_CORPORATION_DECKS, cardName);
}

export function getProjectCardByName(
    cardName: string
): IProjectCard | undefined {
    return Decks.findByName(
        ALL_PROJECT_DECKS.concat(ALL_PRELUDE_DECKS),
        cardName
    );
}

export function getCardExpansionByName(cardName: string): string {
    const manifest = ALL_CARD_MANIFESTS.find((manifest) => {
        const decks: Array<Deck<any>> = [
            manifest.corporationCards,
            manifest.projectCards,
            manifest.preludeCards,
        ];
        return Decks.findByName(decks, cardName);
    });

    if (manifest === undefined) {
        throw new Error(`Can't find card ${cardName}`);
    }
    switch (manifest.module) {
        case GameModule.Base:
            return CorporationGroup.ORIGINAL;
        case GameModule.CorpEra:
            return CorporationGroup.CORPORATION;
        case GameModule.Promo:
            return CorporationGroup.PROMO;
        case GameModule.Venus:
            return CorporationGroup.VENUS_NEXT;
        case GameModule.Colonies:
            return CorporationGroup.CORPORATION;
        case GameModule.Prelude:
            return CorporationGroup.PRELUDE;
        case GameModule.Turmoil:
            return CorporationGroup.TURMOIL;
        case GameModule.Community:
            return CorporationGroup.COMMUNITY;
        default:
            throw new Error(`unknown module ${module} for card ${cardName}`);
    }
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
