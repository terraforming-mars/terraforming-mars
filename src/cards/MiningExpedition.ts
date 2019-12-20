
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

    public canPlay(): boolean {
        return true;
    }
    public play(player: Player, game: Game) {
        if (game.getPlayers().length == 1) {
            player.steel += 2;
            return game.increaseOxygenLevel(player, 1);
        }

        const otherPlayersWithPlants = game.getPlayers().filter(
            (p) => p.plants > 0 && p.id != player.id
        );

        if (otherPlayersWithPlants.length === 1) {
            otherPlayersWithPlants[0].removePlants(player, 2);
            return game.increaseOxygenLevel(player, 1);
        }
        
        return new SelectPlayer(
            otherPlayersWithPlants, 
            "Select player to remove 2 plants from", 
            (foundPlayer: Player) => {
                foundPlayer.removePlants(player, 2);
                player.steel += 2;
            return game.increaseOxygenLevel(player, 1);
        });
    }
}
