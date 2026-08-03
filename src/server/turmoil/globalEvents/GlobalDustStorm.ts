import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEvent} from './GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {Resource} from '../../../common/Resource';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {IPlayer} from '@/server/IPlayer';

export class GlobalDustStorm extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.GLOBAL_DUST_STORM,
      description: 'Lose all heat. Lose 2 M€ for each building tag (max 5, then reduced by influence).',
      revealedDelegate: PartyName.KELVINISTS,
      currentDelegate: PartyName.GREENS,
      behavior: {
        lose: {
          stock: {
            megacredits: {
              tag: Tag.BUILDING,
              turmoil: {max: 5, influence: {subtract: true}},
              each: 2,
            },
          },
        },
      },
      renderData: CardRenderer.builder((b) => {
        b.text('Lose all').heat(1).nbsp.megacredits(-2).slash().tag(Tag.BUILDING).influence({size: Size.SMALL});
      }),
    });
  }
  public override bespokeResolvePlayer(player: IPlayer) {
    if (player.heat > 0) {
      player.stock.deduct(Resource.HEAT, player.heat, {log: true, from: {globalEvent: this}});
    }
  }
}
