
import { IProjectCard } from "./IProjectCard";
import { CardType } from "./CardType";
import { Tags } from "./Tags";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectPlayer } from "../inputs/SelectPlayer";

export class MiningExpedition implements IProjectCard {
    public cost: number = 12;
    public tags: Array<Tags> = [];
    public cardType: CardType = CardType.EVENT;
    public name: string = "Mining Expedition";
    public text: string = "Raise oxygen 1 step. Remove 2 plants from any player. Gain 2 steel.";
    public description: string = "Ruthlessly excavating rich areas.";
    public canPlay(): boolean {
        return true;
    }
    public play(player: Player, game: Game) {
        return new SelectPlayer(game.getPlayers(), "Select player to remove 2 plants from", (foundPlayer: Player) => {
            foundPlayer.removePlants(player, 2);
            player.steel += 2;
            return game.increaseOxygenLevel(player, 1);
        });
    }
}
