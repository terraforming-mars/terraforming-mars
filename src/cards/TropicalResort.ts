
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { Resources } from '../Resources';

export class TropicalResort implements IProjectCard {
    public cost: number = 13;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = "Tropical Resort";
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(player: Player): boolean {
        return player.getProduction(Resources.HEAT) >= 2;
    }
    public play(player: Player, _game: Game) {
        player.setProduction(Resources.HEAT,-2);
        player.megaCreditProduction += 3;
        return undefined;
    }
    public getVictoryPoints() {
        return 2;
    }
}
