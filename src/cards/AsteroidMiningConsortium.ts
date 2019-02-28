
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectPlayer } from "../inputs/SelectPlayer";

export class AsteroidMiningConsortium implements IProjectCard {
    public cost: number = 13;
    public tags: Array<Tags> = [Tags.JOVIAN];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = "Asteroid Mining Consortium";
    public text: string = "Requires that you have titanium production. Decrease any titanium production 1 step and increase your own 1 step. Gain 1 victory point.";
    public description: string = "Your hold on the titanium market tightens.";
    public play(player: Player, game: Game) {
        if (player.titaniumProduction < 1) {
            throw "Requires that you have titanium production";
        }
        player.victoryPoints++;
        return new SelectPlayer(this.name, game.getPlayers(), "Select player to decrease", (foundPlayer: Player) => {
            foundPlayer.titaniumProduction = Math.max(0, foundPlayer.titaniumProduction - 1);
            player.titaniumProduction++;
            return undefined;
        });
    }
}
