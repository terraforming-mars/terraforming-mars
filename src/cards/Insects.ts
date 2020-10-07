
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { Resources } from '../Resources';
import { CardName } from '../CardName';

export class Insects implements IProjectCard {
    public cost: number = 9;
    public tags: Array<Tags> = [Tags.MICROBES];
    public cardType: CardType = CardType.AUTOMATED;
    public name: CardName = CardName.INSECTS;
    public canPlay(player: Player, game: Game): boolean {
        return game.getOxygenLevel() >= 6 - player.getRequirementsBonus(game);
    }
    public play(player: Player) {
        player.addProduction(Resources.PLANTS, player.getTagCount(Tags.PLANT));
        return undefined;
    }
}
