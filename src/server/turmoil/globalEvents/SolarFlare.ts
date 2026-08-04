import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEvent} from './GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {Resource} from '../../../common/Resource';
import {Turmoil} from '../Turmoil';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {IPlayer} from '@/server/IPlayer';

export class SolarFlare extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.SOLAR_FLARE,
      description: 'Lose 3 M€ for each space tag (max 5, then reduced by influence).',
      revealedDelegate: PartyName.UNITY,
      currentDelegate: PartyName.KELVINISTS,
      renderData: CardRenderer.builder((b) => {
        b.minus().megacredits(3).slash().tag(Tag.SPACE).influence({size: Size.SMALL});
      }),
    });
  }
  public override bespokeResolvePlayer(player: IPlayer) {
    const turmoil = Turmoil.getTurmoil(player.game);
    const amount = Math.min(5, player.tags.count(Tag.SPACE, 'raw')) - turmoil.getInfluence(player);
    if (amount > 0) {
      player.stock.deduct(Resource.MEGACREDITS, amount * 3, {log: true, from: {globalEvent: this}});
    }
  }
}
