import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Game } from '../../Game';

export class Solarnet implements IProjectCard {
    public cost: number = 7;
    public tags: Array<Tags> = [];
    public name: string = "Solarnet";
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(player: Player): boolean {
        return player.getTagCount(Tags.VENUS) >= 1 && player.getTagCount(Tags.EARTH) >= 1 && player.getTagCount(Tags.JOVIAN) >= 1;
      }
    public play(player: Player, game: Game) {
        player.cardsInHand.push(game.dealer.dealCard());
        player.cardsInHand.push(game.dealer.dealCard());
        return undefined;
    }
    public getVictoryPoints() {
        return 1;
    } 
}