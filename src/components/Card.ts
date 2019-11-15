
import Vue from "vue";

import { IProjectCard } from "../cards/IProjectCard";
import { ICard } from "../cards/ICard";
import { BeginnerCorporation } from "../cards/corporation/BeginnerCorporation";
import { ALL_PRELUDE_CORPORATIONS, ALL_CORPORATION_CARDS, ALL_PROJECT_CARDS, ALL_PRELUDE_CARDS, ALL_PRELUDE_PROJECTS_CARDS } from "../Dealer";
import { CardType } from "../cards/CardType";
import { Tags } from "../cards/Tags";
import { ResourceType } from "../ResourceType";
import { HTML_DATA } from "../HTML_data";

function getCorporationCardByName(cardName: string): ICard | undefined {
    if (cardName === (new BeginnerCorporation()).name) {
        return new BeginnerCorporation();
    }
    return ALL_CORPORATION_CARDS.find((card) => card.name === cardName) || ALL_PRELUDE_CORPORATIONS.find((card) => card.name === cardName) ;
}

export function getProjectCardByName(cardName: string): IProjectCard | undefined {
    return ALL_PROJECT_CARDS.find((card) => card.name === cardName) || ALL_PRELUDE_CARDS.find((card) => card.name === cardName) || ALL_PRELUDE_PROJECTS_CARDS.find((card) => card.name === cardName);
}

function getData(cardName: string): string | undefined {
    return HTML_DATA.get(cardName);
}

export const Card = Vue.component("card", {
    props: [
        "card",
        "hideCost",
        "resources"
    ],
    methods: {
        getData: function() {
            return getData(this.card);
        },
        getCard: function () {
            return getProjectCardByName(this.card) || getCorporationCardByName(this.card);
        },
        getResourceType: function () {
            return ResourceType;
        },
        getEventColor: function (cardType: CardType) {
            if (cardType === CardType.EVENT) {
                return "red";
            } else if (cardType === CardType.ACTIVE) {
                return "blue";
            } else if (cardType === CardType.AUTOMATED) {
                return "green";
            } else {
                return "black";
            }
        },
        isAnimalTag: function (tag: Tags) {
            return tag === Tags.ANIMAL;
        },
        isBuildingTag: function (tag: Tags) {
            return tag === Tags.STEEL;
        },
        isCityTag: function (tag: Tags) {
            return tag === Tags.CITY;
        },
        isEarthTag: function (tag: Tags) {
            return tag === Tags.EARTH;
        },
        isEnergyTag: function (tag: Tags) {
            return tag === Tags.ENERGY;
        },
        isJovianTag: function (tag: Tags) {
            return tag === Tags.JOVIAN;
        },
        isMicrobesTag: function (tag: Tags) {
            return tag === Tags.MICROBES;
        },
        isPlantTag: function (tag: Tags) {
            return tag === Tags.PLANT;
        },
        isScienceTag: function (tag: Tags) {
            return tag === Tags.SCIENCE;
        },
        isSpaceTag: function (tag: Tags) {
            return tag === Tags.SPACE;
        }
    },
    template: `
    <span v-html=this.getData()></span>
    `
});

