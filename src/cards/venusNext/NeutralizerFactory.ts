
import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Game } from '../../Game';

export class NeutralizerFactory  implements IProjectCard {
    public cost: number = 7;
    public tags: Array<Tags> = [Tags.VENUS];
    public name: string = "Neutralizer Factory";
    public cardType: CardType = CardType.AUTOMATED;

    public canPlay(player: Player, game: Game): boolean {
        return game.getVenusScaleLevel() >= 10 - (2 * player.getRequirementsBonus(game, true));
    }

    public play(player: Player, game: Game) {
        game.increaseVenusScaleLevel(player,1);
        return undefined;
    }
}