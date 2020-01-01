
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { Resources } from '../Resources';

export class Worms implements IProjectCard {
    public cost: number = 8;
    public tags: Array<Tags> = [Tags.MICROBES];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = "Worms";
    public canPlay(player: Player, game: Game): boolean {
        return game.getOxygenLevel() >= 4 - player.getRequirementsBonus(game);
    }
    public play(player: Player) {
        player.setProduction(Resources.PLANTS, Math.floor((player.getTagCount(Tags.MICROBES) + 1) / 2));
        return undefined;
    }
}
