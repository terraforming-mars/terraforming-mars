import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEvent} from './GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {IPlayer} from '../../IPlayer';
import {Resource} from '../../../common/Resource';
import {Turmoil} from '../Turmoil';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';

export class StrongSociety extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.STRONG_SOCIETY,
      description: 'Gain 2 M€ for each city tile (max 5) and influence.',
      revealedDelegate: PartyName.REDS,
      currentDelegate: PartyName.MARS,
      renderData: CardRenderer.builder((b) => {
        b.megacredits(2).slash().city().influence({size: Size.SMALL});
      }),
    });
  }
  public override bespokeResolvePlayer(player: IPlayer) {
    const turmoil = Turmoil.getTurmoil(player.game);
    const amount = Math.min(5, player.game.board.getCities(player).length) + turmoil.getInfluence(player);
    if (amount > 0) {
      player.stock.add(Resource.MEGACREDITS, amount * 2, {log: true, from: {globalEvent: this}});
    }
  }
}
