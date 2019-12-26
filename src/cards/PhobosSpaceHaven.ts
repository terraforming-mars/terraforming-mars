
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SpaceName } from "../SpaceName";
import { SpaceType } from "../SpaceType";

export class PhobosSpaceHaven implements IProjectCard {
    public cost: number = 25;
    public nonNegativeVPIcon: boolean = true;
    public tags: Array<Tags> = [Tags.SPACE, Tags.CITY];
    public name: string = "Phobos Space Haven";
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(): boolean {
        return true;
    }
    public play(player: Player, game: Game) {
        game.addCityTile(player, SpaceName.PHOBOS_SPACE_HAVEN, SpaceType.COLONY);
        player.titaniumProduction++;
        player.victoryPoints += 3;
        return undefined;
    }
}
