
import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { SpaceName } from "../../SpaceName";
import { SpaceType } from "../../SpaceType";
import { Resources } from '../../Resources';


export class MaxwellBase implements IProjectCard {
    public cost: number = 18;
    public tags: Array<Tags> = [Tags.CITY, Tags.VENUS];
    public name: string = "Maxwell Base";
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(player: Player): boolean {
        return player.getProduction(Resources.ENERGY) >= 1;
    }
    public play(player: Player, game: Game) {
        player.setProduction(Resources.ENERGY,-1);
        player.setProduction(Resources.MEGACREDITS,3);
        game.addCityTile(player, SpaceName.MAXWELL_BASE, SpaceType.COLONY);
        return undefined;
    }
}
