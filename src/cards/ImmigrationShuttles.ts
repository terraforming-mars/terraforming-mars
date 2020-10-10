
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { Resources } from '../Resources';
import { CardName } from '../CardName';

export class ImmigrationShuttles implements IProjectCard {
    public cost: number = 31;
    public tags: Array<Tags> = [Tags.EARTH, Tags.SPACE];
    public name: CardName = CardName.IMMIGRATION_SHUTTLES;
    public cardType: CardType = CardType.AUTOMATED;

    public getVictoryPoints(_player: Player, game: Game) {
        return Math.floor(game.getCitiesInPlay() / 3);
    }
    public play(player: Player) {
        player.addProduction(Resources.MEGACREDITS,5);
        return undefined;
    }
}
