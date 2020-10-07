
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { Resources } from '../Resources';
import { CardName } from '../CardName';

export class Heather implements IProjectCard {
    public cost: number = 6;
    public tags: Array<Tags> = [Tags.PLANT];
    public name: CardName = CardName.HEATHER;
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(player: Player, game: Game): boolean {
        return game.getTemperature() >= -14 - (2 * player.getRequirementsBonus(game));
    }
    public play(player: Player) {
        player.addProduction(Resources.PLANTS);
        player.plants++;
        return undefined;
    }
}
