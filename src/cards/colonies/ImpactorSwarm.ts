import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from '../CardType';
import { Player } from "../../Player";
import { CardName } from '../../CardName';
import { Game } from '../../Game';
import { SelectPlayer } from "../../inputs/SelectPlayer";


export class ImpactorSwarm implements IProjectCard {
    public cost: number = 11;
    public tags: Array<Tags> = [Tags.SPACE];
    public name: string = CardName.IMPACTOR_SWARM;
    public cardType: CardType = CardType.EVENT;

    public canPlay(player: Player): boolean {
        return player.getTagCount(Tags.JOVIAN) >= 2;
    }

    public play(player: Player, game: Game) {

        const otherPlayersWithPlants = player.getOtherPlayersWithPlantsToRemove(game);

        if (otherPlayersWithPlants.length === 1) {
            otherPlayersWithPlants[0].removePlants(player, 2, game);
            player.heat += 12;
            return undefined;
        } else if (otherPlayersWithPlants.length === 0) {
            player.heat += 12;
            return undefined;
        }
        
        return new SelectPlayer(
            otherPlayersWithPlants, 
            "Select player to remove 2 plants from", 
            (foundPlayer: Player) => {
                foundPlayer.removePlants(player, 2, game);
                player.heat += 12;
            return undefined;
        });
    }
}
