
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { Resources } from '../Resources';

export class Trees implements IProjectCard {
    public cost: number = 13;
    public tags: Array<Tags> = [Tags.PLANT];
    public name: string = "Trees";
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(player: Player, game: Game): boolean {
        return game.getTemperature() >= -4 - (2 * player.getRequirementsBonus(game));
    }
    public play(player: Player) {
        player.setProduction(Resources.PLANTS,3);
        player.plants++;
        return undefined;
    }
    public getVictoryPoints() {
        return 1;
    }
}
