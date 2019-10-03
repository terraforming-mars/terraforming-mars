
import Vue from "vue";

import { IProjectCard } from "../cards/IProjectCard";
import { ICard } from "../cards/ICard";
import { BeginnerCorporation } from "../cards/corporation/BeginnerCorporation";
import { ALL_CORPORATION_CARDS, ALL_PROJECT_CARDS } from "../Dealer";
import { CardType } from "../cards/CardType";
import { Tags } from "../cards/Tags";
import { ResourceType } from "../ResourceType";

function getCorporationCardByName(cardName: string): ICard | undefined {
    if (cardName === (new BeginnerCorporation()).name) {
        return new BeginnerCorporation();
    }
    return ALL_CORPORATION_CARDS.find((card) => card.name === cardName);
}

export function getProjectCardByName(cardName: string): IProjectCard | undefined {
    return ALL_PROJECT_CARDS.find((card) => card.name === cardName);
}

export const Card = Vue.component("card", {
    props: [
        "card",
        "hideCost",
        "resources"
    ],
    data: function () {
        return {};
    },
    methods: {
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
        <span>
            <span :style="'font-weight:bold;color:' + this.getEventColor(this.getCard().cardType)">{{this.card}}</span>
            <span v-if="this.hideCost !== 'true' && this.getCard().cost !== undefined">Costs {{this.getCard().cost}}.</span>
            <span v-if="this.getCard().startingMegaCredits !== undefined">Start with {{this.getCard().startingMegaCredits}} mega credits.</span>
            <span v-if="this.getEventColor(this.getCard().cardType) === 'red'"><img height="20" src="/assets/event-tag.png" /></span><span v-for="tag in this.getCard().tags">
                <img v-if="isEnergyTag(tag)" height="20" src="/assets/power-tag.png" />
                <img v-else-if="isPlantTag(tag)" height="20" src="/assets/plant-tag.png" />
                <img v-else-if="isBuildingTag(tag)" height="20" src="/assets/building-tag.png" />
                <img v-else-if="isJovianTag(tag)" height="20" src="/assets/jovian-tag.png" />
                <img v-else-if="isSpaceTag(tag)" height="20" src="/assets/space-tag.png" />
                <img v-else-if="isScienceTag(tag)" height="20" src="/assets/science-tag.png" />
                <img v-else-if="isMicrobesTag(tag)" height="20" src="/assets/microbes-tag.png" />
                <img v-else-if="isEarthTag(tag)" height="20" src="/assets/earth-tag.png" />
                <img v-else-if="isCityTag(tag)" height="20" src="/assets/city-tag.png" />
                <img v-else-if="isAnimalTag(tag)" height="20" src="/assets/animal-tag.png" />
                <span v-else>{{tag}}</span>
            </span>
            <span v-if="this.getCard().actionText" style="font-weight:bold">{{this.getCard().actionText}}</span>
            <span>{{this.getCard().text}}</span>
            <i>{{this.getCard().description}}</i>
            <strong v-if="this.getCard().resourceType === getResourceType().ANIMAL">{{this.resources}} animals</strong>
            <strong v-if="this.getCard().resourceType === getResourceType().FIGHTER">{{this.resources}} fighter resources</strong>
            <strong v-if="this.getCard().resourceType === getResourceType().MICROBE">{{this.resources}} microbes</strong>
            <strong v-if="this.getCard().resourceType === getResourceType().SCIENCE">{{this.resources}} science resources</strong>
        </span>`
});

