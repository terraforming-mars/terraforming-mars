
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { Resources } from '../Resources';

export class TollStation implements IProjectCard {
    public cost: number = 12;
    public tags: Array<Tags> = [Tags.SPACE];
    public name: string = "Toll Station";
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(): boolean {
        return true;
    }
    public play(player: Player, game: Game) {
        let amount = game.getPlayers()
        .filter((aPlayer) => aPlayer !== player)
        .map((opponent) => opponent.getTagCount(Tags.SPACE))
        .reduce((a, c) => a + c, 0);
        player.setProduction(Resources.MEGACREDITS, amount);
        return undefined;
    }
}
