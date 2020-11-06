
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game"; 
import { Resources } from "../Resources";
import { CardName } from "../CardName";

export class WavePower implements IProjectCard {
    public tags = [Tags.ENERGY];
    public cost = 8;
    public name = CardName.WAVE_POWER;
    public cardType = CardType.AUTOMATED;
    public canPlay(player: Player, game: Game): boolean {
        return game.board.getOceansOnBoard() >= 3 - player.getRequirementsBonus(game);
    }
    public play(player: Player) {
        player.addProduction(Resources.ENERGY);
        return undefined;
    }
    public getVictoryPoints() {
        return 1;
    }
}

