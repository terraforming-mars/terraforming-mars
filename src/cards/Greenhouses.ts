
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardName } from '../CardName';

export class Greenhouses implements IProjectCard {
    public cost: number = 6;
    public tags: Array<Tags> = [Tags.PLANT, Tags.STEEL];
    public name: string = CardName.GREENHOUSES;
    public cardType: CardType = CardType.AUTOMATED;

    public play(player: Player, game: Game) {
        player.plants += game.getCitiesInPlay();
        return undefined;
    }
}
