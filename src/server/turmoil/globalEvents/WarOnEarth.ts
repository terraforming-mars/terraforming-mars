import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEvent} from './GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {Turmoil} from '../Turmoil';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {IPlayer} from '@/server/IPlayer';

export class WarOnEarth extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.WAR_ON_EARTH,
      description: 'Reduce TR 4 steps. Each influence prevents 1 step.',
      revealedDelegate: PartyName.MARS,
      currentDelegate: PartyName.KELVINISTS,
      renderData: CardRenderer.builder((b) => {
        b.minus().text('4').tr(1).influence({size: Size.SMALL});
      }),
    });
  }
  public override bespokeResolvePlayer(player: IPlayer) {
    const turmoil = Turmoil.getTurmoil(player.game);
    player.decreaseTerraformRating(Math.max(0, 4 - turmoil.getInfluence(player)), {log: true});
  }
}
