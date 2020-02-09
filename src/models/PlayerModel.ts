import { CardModel } from "./CardModel";
import { Color } from "../Color";
import { VictoryPointsBreakdown } from "../VictoryPointsBreakdown";
import { IColony } from "../colonies/Colony";

export interface PlayerModel {
    corporationCard: string;
    corporationCardResources: number;
    playedCards: Array<CardModel>;
    cardsInHandNbr: number;
    color: Color;
    energy: number;
    energyProduction: number;
    heat: number;
    heatProduction: number;
    id: string;
    megaCredits: number;
    megaCreditProduction: number;
    name: string;
    plants: number;
    plantProduction: number;
    steel: number;
    steelProduction: number;
    steelValue: number;
    terraformRating: number;
    titanium: number;
    titaniumProduction: number;
    titaniumValue: number;
    victoryPoints: number;
    victoryPointsBreakdown: VictoryPointsBreakdown;
    isSoloModeWin: boolean;
    gameAge: number;
    isActive: boolean;
    venusNextExtension: boolean;
    venusScaleLevel: number;
    boardName: string;
    colonies: Array<IColony>;
}
