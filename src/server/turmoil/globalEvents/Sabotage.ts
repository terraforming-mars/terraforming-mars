import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEvent} from './GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {Resource} from '../../../common/Resource';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {IPlayer} from '@/server/IPlayer';

export class Sabotage extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.SABOTAGE,
      description: 'Decrease steel and energy production 1 step each. Gain 1 steel per influence.',
      revealedDelegate: PartyName.UNITY,
      currentDelegate: PartyName.REDS,
      behavior: {
        stock: {steel: {turmoil: {influence: {}}}},
      },
      renderData: CardRenderer.builder((b) => {
        b.production((pb) => pb.minus().energy(1).steel(1)).nbsp.nbsp;
        b.steel(1).slash().influence({size: Size.MEDIUM});
      }),
    });
  }
  public override bespokeResolvePlayer(player: IPlayer) {
    // This conditional isn't to prevent negative production, but to prevent misleading logging when the production diff is zero.
    if (player.production.energy >= 1) {
      player.production.add(Resource.ENERGY, -1, {log: true, from: {globalEvent: this}});
    }
    if (player.production.steel >= 1) {
      player.production.add(Resource.STEEL, -1, {log: true, from: {globalEvent: this}});
    }
  }
}
