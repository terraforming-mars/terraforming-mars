
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { Resources } from '../Resources';

export class Moss implements IProjectCard {
    public cost: number = 4;
    public tags: Array<Tags> = [Tags.PLANT];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = "Moss";
    public canPlay(player: Player, game: Game): boolean {
        return game.board.getOceansOnBoard() >= 3 - player.getRequirementsBonus(game) && player.plants >= 1;
    }
    public play(player: Player) {
        player.plants--;
        player.setProduction(Resources.PLANTS);
        return undefined;
    }
}

