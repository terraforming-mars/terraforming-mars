import {IProjectCard} from './cards/IProjectCard';
import {CorporationCard} from './cards/corporation/CorporationCard';
import {PlayerInput} from './PlayerInput';
import {Color} from './Color';
import {VictoryPointsBreakdown} from './VictoryPointsBreakdown';

export interface SerializedPlayer {
    id: string;
    name: string;
    color: Color;
    beginner: boolean;
    handicap: number;
    waitingFor?: PlayerInput;
    waitingForCb?: () => void;

    corporationCard: CorporationCard | undefined;
    pickedCorporationCard: CorporationCard | undefined;

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
    actionsThisGeneration: Set<string>;
    lastCardPlayed: IProjectCard | undefined;

    dealtCorporationCards: Array<CorporationCard>;
    dealtPreludeCards: Array<IProjectCard>;
    dealtProjectCards: Array<IProjectCard>;

    cardsInHand: Array<IProjectCard>;
    preludeCardsInHand: Array<IProjectCard>;
    playedCards: Array<IProjectCard>;
    draftedCards: Array<IProjectCard>;

    generationPlayed: Map<string, number>;
    cardCost: number;
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
    removingPlayers: Array<string>;
}
