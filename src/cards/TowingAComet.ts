
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectSpace } from "../inputs/SelectSpace";
import { ISpace } from "../ISpace";
import { MAX_OCEAN_TILES } from '../constants';

export class TowingAComet implements IProjectCard {
    public cost: number = 23;
    public tags: Array<Tags> = [Tags.SPACE];
    public cardType: CardType = CardType.EVENT;
    public name: string = "Towing A Comet";
    public canPlay(_player: Player, _game: Game): boolean {
        return true;
    }
    public play(player: Player, game: Game) {

        if (game.getOceansOnBoard() === MAX_OCEAN_TILES) {
            player.plants += 2;
            return game.increaseOxygenLevel(player, 1);
        }

        return new SelectSpace("Select place for oean tile", game.getAvailableSpacesForOcean(player), (foundSpace: ISpace) => {
            game.addOceanTile(player, foundSpace.id)
            player.plants += 2;
            return game.increaseOxygenLevel(player, 1);
        });
    }
}
