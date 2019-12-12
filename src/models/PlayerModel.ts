import { CardModel } from "./CardModel";
import { Color } from "../Color";
import { VictoryPointsBreakdown } from "../VictoryPointsBreakdown";

export interface PlayerModel {
    corporationCard: string;
    playedCards: Array<CardModel>;
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
    terraformRating: number;
    titanium: number;
    titaniumProduction: number;
    victoryPoints: number;
    victoryPointsBreakdown: VictoryPointsBreakdown;
}
