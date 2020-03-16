
import { IActionCard } from "./ICard";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardName } from '../CardName';

export class OreProcessor implements IActionCard, IProjectCard {
    public cost: number = 13;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = CardName.ORE_PROCESSOR;
    public cardType: CardType = CardType.ACTIVE;

    public play(_player: Player, _game: Game) {
        return undefined;
    }
    public canAct(player: Player): boolean {
        return player.energy >= 4;
    }
    public action(player: Player, game: Game) {
        player.energy -= 4;
        player.titanium++;
        return game.increaseOxygenLevel(player, 1);
    }
}
