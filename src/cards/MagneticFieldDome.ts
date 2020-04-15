
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { Game } from "../Game";
import { Player } from "../Player";
import { CardType } from "./CardType";
import { Resources } from '../Resources';
import { CardName } from '../CardName';

export class MagneticFieldDome implements IProjectCard {
    public cost: number = 5;
    public tags: Array<Tags> = [Tags.STEEL];
    public cardType: CardType = CardType.AUTOMATED;
    public name: CardName = CardName.MAGNETIC_FIELD_DOME;
    public hasRequirements = false;
    public canPlay(player: Player): boolean {
        return player.getProduction(Resources.ENERGY) >= 2;
    }
    public play(player: Player, game: Game) {
        player.setProduction(Resources.ENERGY,-2);
        player.setProduction(Resources.PLANTS);
        player.increaseTerraformRating(game);
        return undefined;
    }
}
