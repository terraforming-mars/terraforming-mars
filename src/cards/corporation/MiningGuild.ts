
import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { CorporationCard } from "./CorporationCard";
import { SpaceBonus } from "../../SpaceBonus";
import { ISpace } from "../../ISpace";

export class MiningGuild extends CorporationCard {
    public name: string = "Mining Guild";
    public tags: Array<Tags> = [Tags.STEEL, Tags.STEEL];
    public startingMegaCredits: number = 30;
    public text: string = "You start with 5 steel, and 1 steel production.";
    public effect: string = "Each time you place a tile on an area with steel or titanium placement bonus, increase your steel production 1 step.";
    public description: string = "The earliest private enterprises on Mars focused on mining and exporting minerals off the surface. As the mega-corporations arrive to terraform, the miners unite in the Guild to defend their interests. With their expertise and knowledge of the planet they will be a worthy contender in the race.";
    public play(player: Player, _game: Game): Promise<void> {
        player.steel = 5;
        player.steelProduction = 1;
        player.onTilePlaced((space: ISpace) => {
            if (space.bonus.indexOf(SpaceBonus.STEEL) !== -1 || space.bonus.indexOf(SpaceBonus.TITANIUM) !== -1) {
                player.steelProduction++;
            }
        });
        return Promise.resolve();
    }
}
