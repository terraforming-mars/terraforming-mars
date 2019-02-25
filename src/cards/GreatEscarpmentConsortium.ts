
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectPlayer } from "../inputs/SelectPlayer";

export class GreatEscarpmentConsortium implements IProjectCard {
    public cost: number = 6;
    public tags: Array<Tags> = [];
    public name: string = "Great Escarpment Consortium";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Requires that you have steel production. Decrease any steel production 1 step and increase your own 1 step.";
    public description: string = "The border between the northern plains and the southern highlands is rich in minerals. Control it, and you will control the global mining business.";
    public play(player: Player, game: Game) {
        if (player.steelProduction < 1) {
            throw "Requires that you have steel production.";
        }
        return new SelectPlayer(this.name, game.getPlayers(), "Select player to decrease steel production", (foundPlayer: Player) => {
            foundPlayer.steelProduction = Math.max(0, foundPlayer.steelProduction - 1);
            player.steelProduction++;
            return undefined;
        });
    }
}
