import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEvent} from './GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {Resource} from '../../../common/Resource';
import {Turmoil} from '../Turmoil';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {IPlayer} from '@/server/IPlayer';

export class SuccessfulOrganisms extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.SUCCESSFUL_ORGANISMS,
      description: 'Gain 1 plant per plant production (max 5) and influence.',
      revealedDelegate: PartyName.MARS,
      currentDelegate: PartyName.SCIENTISTS,
      renderData: CardRenderer.builder((b) => {
        b.plants(1).slash().production((pb) => pb.plants(1)).nbsp.influence({size: Size.SMALL});
      }),
    });
  }
  public override bespokeResolvePlayer(player: IPlayer) {
    const turmoil = Turmoil.getTurmoil(player.game);
    player.stock.add(Resource.PLANTS, Math.min(5, player.production.plants) + turmoil.getInfluence(player), {log: true, from: {globalEvent: this}});
  }
}
