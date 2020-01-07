
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { Resources } from '../Resources';

export class KelpFarming implements IProjectCard {
    public cost: number = 17;
    public tags: Array<Tags> = [Tags.PLANT];
    public name: string = "Kelp Farming";
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(player: Player, game: Game): boolean {
        return game.board.getOceansOnBoard() >= 6 - player.getRequirementsBonus(game);
    }
    public play(player: Player) {
        player.setProduction(Resources.MEGACREDITS,2);
        player.setProduction(Resources.PLANTS,3);
        player.plants += 2;
        return undefined;
    }
    public getVictoryPoints() {
        return 1;
    }
}
