
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game"; 
import { Resources } from '../Resources';

export class WavePower implements IProjectCard {
    public tags: Array<Tags> = [Tags.ENERGY];
    public cost: number = 8;
    public name: string = "Wave Power";
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(player: Player, game: Game): boolean {
        return game.getOceansOnBoard() >= 3 - player.getRequirementsBonus(game);
    }
    public play(player: Player) {
        player.setProduction(Resources.ENERGY);
        return undefined;
    }
    public getVictoryPoints() {
        return 1;
    }
}

