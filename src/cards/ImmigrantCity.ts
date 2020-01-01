
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { ISpace } from "../ISpace";
import { SelectSpace } from "../inputs/SelectSpace";
import { TileType } from "../TileType";
import { Resources } from '../Resources';

export class ImmigrantCity implements IProjectCard {
    public cost: number = 13;
    public tags: Array<Tags> = [Tags.CITY, Tags.STEEL];
    public cardType: CardType = CardType.ACTIVE;
    public name: string = "Immigrant City";
    public canPlay(player: Player,game: Game): boolean {
        return player.getProduction(Resources.ENERGY) >= 1 && player.megaCreditProduction >= -3 && game.getAvailableSpacesForCity(player).length >= 0;
    }
    public onTilePlaced(player: Player, space: ISpace) {
        if (space.tile !== undefined && space.tile.tileType === TileType.CITY) {
            player.megaCreditProduction++;
        }
    }
    public play(player: Player, game: Game) {
        return new SelectSpace("Select space for city tile", game.getAvailableSpacesForCity(player), (space: ISpace) => {
            game.addCityTile(player, space.id);
            player.setProduction(Resources.ENERGY,-1);
            player.megaCreditProduction++;
            return undefined;
        });
    }
}
