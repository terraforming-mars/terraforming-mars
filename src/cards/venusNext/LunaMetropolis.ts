import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { SpaceName } from "../../SpaceName";
import { SpaceType } from "../../SpaceType";
import { Resources } from "../../Resources";
import { CardName } from "../../CardName";

export class LunaMetropolis implements IProjectCard {
    public cost = 21;
    public tags = [Tags.CITY, Tags.SPACE, Tags.EARTH];
    public name = CardName.LUNA_METROPOLIS;
    public cardType = CardType.AUTOMATED;
    public play(player: Player, game: Game) {
        player.addProduction(Resources.MEGACREDITS, player.getTagCount(Tags.EARTH) + 1);
        game.addCityTile(player, SpaceName.LUNA_METROPOLIS, SpaceType.COLONY);
        return undefined;
    }
    public getVictoryPoints() {
        return 2;
    }
}    