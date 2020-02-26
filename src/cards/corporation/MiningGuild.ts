
import { Tags } from "../Tags";
import { Player } from "../../Player";
import { CorporationCard } from "./CorporationCard";
import { ISpace } from "../../ISpace";
import { SpaceBonus } from "../../SpaceBonus";
import { Resources } from '../../Resources';
import { SpaceType } from "../../SpaceType";

export class MiningGuild implements CorporationCard {
    public name: string = "Mining Guild";
    public tags: Array<Tags> = [Tags.STEEL, Tags.STEEL];
    public startingMegaCredits: number = 30;
    public onTilePlaced(player: Player, space: ISpace) {
        if (
            (space.player === player || (space.spaceType === SpaceType.OCEAN && player.isCorporation(this.name) ))
            && (space.bonus.indexOf(SpaceBonus.STEEL) !== -1 || space.bonus.indexOf(SpaceBonus.TITANIUM) !== -1)) {
            player.setProduction(Resources.STEEL);
        }
    }
    public play(player: Player) {
        player.steel = 5;
        player.setProduction(Resources.STEEL);
        return undefined;
    }
}
