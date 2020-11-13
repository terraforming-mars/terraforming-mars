import {IProjectCard} from './cards/IProjectCard';
import {CorporationCard} from './cards/corporation/CorporationCard';
import {PlayerId} from './Player';
import {PlayerInput} from './PlayerInput';
import {CardName} from './CardName';
import {Color} from './Color';
import {SerializedCard} from './SerializedCard';
import {VictoryPointsBreakdown} from './VictoryPointsBreakdown';

export interface SerializedPlayer {
    id: string;
    name: string;
    color: Color;
    beginner: boolean;
    handicap: number;
    waitingFor?: PlayerInput;
    waitingForCb?: () => void;

    corporationCard: SerializedCard | undefined;
    corporationInitialActionDone: boolean;
    hasIncreasedTerraformRatingThisGeneration: boolean;
    pickedCorporationCard: CardName | CorporationCard | undefined;

    terraformRating: number;
    terraformRatingAtGenerationStart: number;

    megaCredits: number;
    megaCreditProduction: number;
    steel: number;
    steelProduction: number;
    titanium: number;
    titaniumProduction: number;
    plants: number;
    plantProduction: number;
    energy: number;
    energyProduction: number;
    heat: number;
    heatProduction: number;

    titaniumValue: number;
    steelValue: number;
    canUseHeatAsMegaCredits: boolean;

    actionsTakenThisRound: number;
    actionsThisGeneration: Array<string>;
    lastCardPlayed: CardName | IProjectCard | undefined;

    dealtCorporationCards: Array<CardName> | Array<CorporationCard>;
    dealtPreludeCards: Array<CardName> | Array<IProjectCard>;
    dealtProjectCards: Array<CardName> | Array<IProjectCard>;

    cardsInHand: Array<CardName> | Array<IProjectCard>;
    preludeCardsInHand: Array<CardName> | Array<IProjectCard>;
    playedCards: Array<SerializedCard>;
    draftedCards: Array<CardName> | Array<IProjectCard>;
    removedFromPlayCards: Array<CardName> | Array<IProjectCard>;

    generationPlayed: Array<[string, number]>;
    cardCost: number;
    cardDiscount: number;
    colonyVictoryPoints: number;
    shouldTriggerCardEffect: boolean;
    scienceTagCount: number;
    needsToDraft: boolean | undefined;

    fleetSize: number;
    tradesThisTurn: number;
    colonyTradeOffset: number;
    colonyTradeDiscount: number;

    turmoilScientistsActionUsed: boolean;

    powerPlantCost: number;
    victoryPointsBreakdown: VictoryPointsBreakdown;
    oceanBonus: number;

    plantsNeededForGreenery: number;
    removingPlayers: Array<PlayerId>;
}
