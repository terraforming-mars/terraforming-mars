
import { CardType } from "./CardType";
import { Tags } from "./Tags";
import { IProjectCard } from "./IProjectCard";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardName } from '../CardName';

export class WaterSplittingPlant implements IProjectCard {
    public cost: number = 12;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = CardName.WATER_SPLITTING_PLANT;
    public cardType: CardType = CardType.ACTIVE;
    public canPlay(player: Player, game: Game): boolean {
        return game.board.getOceansOnBoard() >= 2 - player.getRequirementsBonus(game);
    }
    public play() {
        return undefined;
    }
    public canAct(player: Player): boolean {
        return player.energy >= 3;
    }
    public action(player: Player, game: Game) {
        player.energy -= 3;
        return game.increaseOxygenLevel(player, 1);
    }
}
