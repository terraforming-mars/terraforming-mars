import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEvent} from './GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {Resource} from '../../../common/Resource';
import {Turmoil} from '../Turmoil';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {IPlayer} from '@/server/IPlayer';

export class Diversity extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.DIVERSITY,
      description: 'Gain 10 M€ if you have 9 or more different tags. Influence counts as unique tags.',
      revealedDelegate: PartyName.SCIENTISTS,
      currentDelegate: PartyName.SCIENTISTS,
      renderData: CardRenderer.builder((b) => {
        b.text('9').diverseTag(1).influence({size: Size.SMALL}).colon().megacredits(10);
      }),
    });
  }
  public override bespokeResolvePlayer(player: IPlayer) {
    const turmoil = Turmoil.getTurmoil(player.game);
    if (player.tags.distinctCount('globalEvent') + turmoil.getInfluence(player) >= 9) {
      player.stock.add(Resource.MEGACREDITS, 10, {log: true, from: {globalEvent: this}});
    }
  }
}
