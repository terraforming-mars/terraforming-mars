import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { ISpace } from "../ISpace";
import { SelectSpace } from "../inputs/SelectSpace";
import { Resources } from '../Resources';
import { CardName } from '../CardName';
import { CorporationName } from "../CorporationName";
import { Board } from "../Board";

export class ImmigrantCity implements IProjectCard {
    public cost: number = 13;
    public tags: Array<Tags> = [Tags.CITY, Tags.STEEL];
    public cardType: CardType = CardType.ACTIVE;
    public name: CardName = CardName.IMMIGRANT_CITY;
    public hasRequirements = false;
    public canPlay(player: Player,game: Game): boolean {
        const hasEnergyProduction = player.getProduction(Resources.ENERGY) >= 1;
        const canPlaceCityOnMars = game.board.getAvailableSpacesForCity(player).length > 0;
        const canDecreaseMcProduction = player.getProduction(Resources.MEGACREDITS) >= -4 || player.isCorporation(CorporationName.THARSIS_REPUBLIC);

        return hasEnergyProduction && canDecreaseMcProduction && canPlaceCityOnMars;
    }
    public onTilePlaced(player: Player, space: ISpace) {
        if (Board.isCitySpace(space)) {
            if (player.shouldTriggerCardEffect) player.setProduction(Resources.MEGACREDITS);
            if (!player.isCorporation(CorporationName.THARSIS_REPUBLIC)) player.shouldTriggerCardEffect = true; // reset value
        }
    }
    public play(player: Player, game: Game) {
        return new SelectSpace("Select space for city tile", game.board.getAvailableSpacesForCity(player), (space: ISpace) => {
            const mcProductionAfterDecrease = player.getProduction(Resources.MEGACREDITS) - 2;
            if (mcProductionAfterDecrease < -6) player.shouldTriggerCardEffect = false;

            game.addCityTile(player, space.id);
            player.setProduction(Resources.ENERGY,-1);
            player.setProduction(Resources.MEGACREDITS, -2);
            return undefined;
        });
    }
}
