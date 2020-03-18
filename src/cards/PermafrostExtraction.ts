
import { CardType } from "./CardType";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectSpace } from "../inputs/SelectSpace";
import { ISpace } from "../ISpace";
import { MAX_OCEAN_TILES } from '../constants';
import { CardName } from '../CardName';

export class PermafrostExtraction implements IProjectCard {
    public cardType: CardType = CardType.EVENT;
    public tags: Array<Tags> = [];
    public cost: number = 8;
    public name: CardName = CardName.PERMAFROST_EXTRACTION;
    public canPlay(player: Player, game: Game): boolean {
        return game.getTemperature() >= -8 - (2 * player.getRequirementsBonus(game));
    }
    public play(player: Player, game: Game) {

        if (game.board.getOceansOnBoard() === MAX_OCEAN_TILES) {
            return undefined;
        }

        return new SelectSpace("Select space for ocean tile", game.board.getAvailableSpacesForOcean(player), (space: ISpace) => {
            game.addOceanTile(player, space.id);
            return undefined;
        });
    }
}
