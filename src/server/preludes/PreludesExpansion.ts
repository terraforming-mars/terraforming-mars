import {Resource} from '../../common/Resource';
import {IPlayer} from '../IPlayer';
import {IPreludeCard} from '../cards/prelude/IPreludeCard';

export class PreludesExpansion {
  public static fizzle(player: IPlayer, card: IPreludeCard): void {
    player.game.log('${0} fizzled. ${1} gains 15 M€.', (b) => b.card(card).player(player));
    player.addResource(Resource.MEGACREDITS, 15);
  }
}
