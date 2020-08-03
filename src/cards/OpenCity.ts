
import { IProjectCard } from "./IProjectCard";
import { CardType } from "./CardType";
import { Tags } from "./Tags";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectSpace } from "../inputs/SelectSpace";
import { ISpace } from "../ISpace";
import { Resources } from '../Resources';
import { CardName } from '../CardName';

export class OpenCity implements IProjectCard {
    public cost: number = 23;
    public tags: Array<Tags> = [Tags.CITY, Tags.STEEL];
    public cardType: CardType = CardType.AUTOMATED;
    public name: CardName = CardName.OPEN_CITY;
    public canPlay(player: Player, game: Game): boolean {
        return game.getOxygenLevel() >= 12 - player.getRequirementsBonus(game) && player.getProduction(Resources.ENERGY) >= 1 && game.board.getAvailableSpacesForCity(player).length > 0;
    }
    public play(player: Player, game: Game) {
        return new SelectSpace("Select space for city tile", game.board.getAvailableSpacesForCity(player), (space: ISpace) => {
            game.addCityTile(player, space.id);
            player.setProduction(Resources.ENERGY,-1);
            player.setProduction(Resources.MEGACREDITS,4);
            player.plants += 2;
            return undefined;
        });
    }
    public getVictoryPoints() {
        return 1;
    }
}
