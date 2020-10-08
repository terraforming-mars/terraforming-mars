
import {CardType} from './CardType';
import {Tags} from './Tags';
import {IProjectCard} from './IProjectCard';
import {Player} from '../Player';
import {Game} from '../Game';
import { Resources } from '../Resources';
import { CardName } from '../CardName';

export class EnergySaving implements IProjectCard {
    public cardType: CardType = CardType.AUTOMATED;
    public cost: number = 15;
    public tags: Array<Tags> = [Tags.ENERGY];
    public name: CardName = CardName.ENERGY_SAVING;

    public play(player: Player, game: Game) {
      player.addProduction(Resources.ENERGY,game.getCitiesInPlay());
      return undefined;
    }
}
