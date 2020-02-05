
import {CardType} from './CardType';
import {Tags} from './Tags';
import {IProjectCard} from './IProjectCard';
import {Player} from '../Player';
import {Game} from '../Game';
import { Resources } from '../Resources';

export class EnergySaving implements IProjectCard {
    public cardType: CardType = CardType.AUTOMATED;
    public cost: number = 15;
    public tags: Array<Tags> = [Tags.ENERGY];
    public name: string = 'Energy Saving';

    public play(player: Player, game: Game) {
      player.setProduction(Resources.ENERGY,game.getCitiesInPlay());
      return undefined;
    }
}
