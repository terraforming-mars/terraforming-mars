import { IProjectCard } from "../IProjectCard";
import { CardType } from "../CardType";
import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { CardName } from "../../CardName";


export class Conscription implements IProjectCard {
    public cardType = CardType.EVENT;
    public cost = 5;
    public tags = [Tags.EARTH];
    public name = CardName.CONSCRIPTION;

    public canPlay(player: Player): boolean {
        return player.getTagCount(Tags.EARTH) >= 2;
    }

    public getCardDiscount(player: Player, _game: Game) {
        if (player.lastCardPlayed !== undefined && player.lastCardPlayed.name === this.name) {
            return 16;
        }
        return 0;
    }
    public play() {
        return undefined;
    } 
    public getVictoryPoints() {
        return -1;
    }
}