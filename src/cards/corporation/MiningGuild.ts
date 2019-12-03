
import { Tags } from "../Tags";
import { Player } from "../../Player";
import { CorporationCard } from "./CorporationCard";
import { ISpace } from "../../ISpace";
import { SpaceBonus } from "../../SpaceBonus";

export class MiningGuild implements CorporationCard {
    public name: string = "Mining Guild";
    public tags: Array<Tags> = [Tags.STEEL, Tags.STEEL];
    public startingMegaCredits: number = 30;
    public onTilePlaced(player: Player, space: ISpace) {
        if (space.player === player && (space.bonus.indexOf(SpaceBonus.STEEL) !== -1 || space.bonus.indexOf(SpaceBonus.TITANIUM) !== -1)) {
            player.steelProduction++;
        }
    }
    public play(player: Player) {
        player.steel = 5;
        player.steelProduction = 1;
        return undefined;
    }
}
