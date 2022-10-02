import {PlayerId} from '../common/Types';
import {CardName} from '../common/cards/CardName';
import {Color} from '../common/Color';
import {SerializedCard} from './SerializedCard';
import {SerializedTimer} from '../common/SerializedTimer';

interface DeprecatedFields {
    corporationCard?: SerializedCard | undefined; // TODO(kberg): remove after 2022-09-01
    corporationInitialActionDone?: boolean; // TODO(kberg): remove field after 2022-09-01
}
export interface SerializedPlayer extends DeprecatedFields{
    actionsTakenThisGame: number;
    actionsTakenThisRound: number;
    actionsThisGeneration: Array<CardName>;
    beginner: boolean;
    canUseHeatAsMegaCredits: boolean;
    canUseTitaniumAsMegacredits: boolean;
    cardCost: number;
    cardDiscount: number;
    cardsInHand: Array<CardName>;
    colonyTradeDiscount: number;
    colonyTradeOffset: number;
    colonyVictoryPoints: number;
    color: Color;
    corporations: Array<SerializedCard> | undefined; // TODO(kberg): remove undefined once it's applied across the board.
    dealtCorporationCards: Array<CardName>;
    dealtPreludeCards: Array<CardName>;
    dealtProjectCards: Array<CardName>;
    draftedCards: Array<CardName>;
    energy: number;
    energyProduction: number;
    fleetSize: number;
    handicap: number;
    hasIncreasedTerraformRatingThisGeneration: boolean;
    hasTurmoilScienceTagBonus: boolean;
    heat: number;
    heatProduction: number;
    id: PlayerId;
    lastCardPlayed?: CardName;
    megaCreditProduction: number;
    megaCredits: number;
    name: string;
    needsToDraft: boolean | undefined;
    oceanBonus: number;
    pendingInitialActions: Array<CardName> | undefined;
    pickedCorporationCard: CardName | undefined;
    plantProduction: number;
    plants: number;
    plantsNeededForGreenery: number;
    playedCards: Array<SerializedCard>;
    politicalAgendasActionUsedCount: number;
    preludeCardsInHand: Array<CardName>;
    removedFromPlayCards: Array<CardName>;
    removingPlayers: Array<PlayerId>;
    scienceTagCount: number;
    steel: number;
    steelProduction: number;
    steelValue: number;
    terraformRating: number;
    terraformRatingAtGenerationStart: number;
    timer: SerializedTimer;
    titanium: number;
    titaniumProduction: number;
    titaniumValue: number;
    totalDelegatesPlaced: number;
    // TODO(kberg): change tradesThisTurn to tradeThisGeneration later
    tradesThisTurn: number;
    turmoilPolicyActionUsed: boolean;
    victoryPointsByGeneration: Array<number>;
}
