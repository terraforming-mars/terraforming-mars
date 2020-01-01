
import { Tags } from "./Tags";
import { IProjectCard } from "./IProjectCard";
import { CardType } from "./CardType";
import { Game } from "../Game";
import { Player } from "../Player";
import { Resources } from '../Resources';

export class PeroxidePower implements IProjectCard {
    public cost: number = 7;
    public tags: Array<Tags> = [Tags.ENERGY, Tags.STEEL];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = "Peroxide Power";
    public canPlay(player: Player): boolean {
        return player.megaCreditProduction >= -4;
    }
    public play(player: Player, _game: Game) {
        player.megaCreditProduction--;
        player.setProduction(Resources.ENERGY,2);
        return undefined;
    }
}
