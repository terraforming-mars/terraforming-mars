
import { Tags } from "../Tags";
import { Player } from "../../Player";
import { CorporationCard } from "./CorporationCard";
import { ISpace } from "../../ISpace";
import { SpaceBonus } from "../../SpaceBonus";

export class MiningGuild implements CorporationCard {
    public name: string = "Mining Guild";
    public tags: Array<Tags> = [Tags.STEEL, Tags.STEEL];
    public startingMegaCredits: number = 30;
    public text: string = "You start with 5 steel, and 1 steel production. Each time you place a tile on an area with steel or titanium placement bonus, increase your steel production 1 step.";
    public description: string = "The earliest private enterprises on Mars focused on mining and exporting minerals off the surface. As the mega-corporations arrive to terraform, the miners unite in the Guild to defend their interests. With their expertise and knowledge of the planet they will be a worthy contender in the race.";
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
