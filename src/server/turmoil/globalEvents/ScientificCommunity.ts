import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEvent} from './GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {Resource} from '../../../common/Resource';
import {Turmoil} from '../Turmoil';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {IPlayer} from '@/server/IPlayer';

export class ScientificCommunity extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.SCIENTIFIC_COMMUNITY,
      description: 'Gain 1 M€ for each card in hand (no limit) and influence.',
      revealedDelegate: PartyName.REDS,
      currentDelegate: PartyName.SCIENTISTS,
      renderData: CardRenderer.builder((b) => {
        b.megacredits(1).slash().cards(1).influence({size: Size.SMALL});
      }),
    });
  }
  public override bespokeResolvePlayer(player: IPlayer) {
    const turmoil = Turmoil.getTurmoil(player.game);
    const amount = player.cardsInHand.length + turmoil.getInfluence(player);
    player.stock.add(Resource.MEGACREDITS, amount, {log: true, from: {globalEvent: this}});
  }
}
