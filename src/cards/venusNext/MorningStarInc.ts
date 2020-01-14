
import { CorporationCard } from "../corporation/CorporationCard";
import { Player } from "../../Player";
import { Tags } from "../Tags";
import { Game } from '../../Game';

export class MorningStarInc implements CorporationCard {
    public name: string = "Morning Star Inc.";
    public tags: Array<Tags> = [Tags.VENUS];
    public startingMegaCredits: number = 50;

    public initialAction(player: Player, game: Game) {
        for (let foundCard of game.drawCardsByTag(Tags.VENUS, 3)) {
            player.cardsInHand.push(foundCard);
        }
        return undefined;
    }

    public getRequirementBonus(_player: Player, _game: Game, venusOnly?: boolean): number {
        if (venusOnly !== undefined && venusOnly) return 2;
        return 0;
    }

    public play() {
        return undefined;
    }
}
