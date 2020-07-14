import { CardType } from "./CardType";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectSpace } from "../inputs/SelectSpace";
import { ISpace } from "../ISpace";
import { MAX_OCEAN_TILES, REDS_RULING_POLICY_COST } from '../constants';
import { CardName } from '../CardName';
import { PartyHooks } from "../turmoil/parties/PartyHooks";
import { PartyName } from "../turmoil/parties/PartyName";

export class PermafrostExtraction implements IProjectCard {
    public cardType: CardType = CardType.EVENT;
    public tags: Array<Tags> = [];
    public cost: number = 8;
    public name: CardName = CardName.PERMAFROST_EXTRACTION;

    public canPlay(player: Player, game: Game): boolean {
        const meetsTemperatureRequirements = game.getTemperature() >= -8 - (2 * player.getRequirementsBonus(game));
        const oceansMaxed = game.board.getOceansOnBoard() === MAX_OCEAN_TILES;
    
        if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && !oceansMaxed) {
          return player.canAfford(this.cost + REDS_RULING_POLICY_COST) && meetsTemperatureRequirements;
        }
    
        return meetsTemperatureRequirements;
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
