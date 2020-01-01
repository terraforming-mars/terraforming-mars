
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { Resources } from '../Resources';

export class NitrophilicMoss implements IProjectCard {
    public cost: number = 8;
    public tags: Array<Tags> = [Tags.PLANT];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = "Nitrophilic Moss";
    public canPlay(player: Player, game: Game): boolean {
        return game.getOceansOnBoard() >= 3 - player.getRequirementsBonus(game) && player.plants >= 2;
    }
    public play(player: Player) {
        player.plants -= 2;
        player.setProduction(Resources.PLANTS,2);
        return undefined;
    }
}
