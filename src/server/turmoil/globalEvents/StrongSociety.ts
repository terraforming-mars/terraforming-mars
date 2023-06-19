import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEvent} from './GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {IGame} from '../../IGame';
import {Resource} from '../../../common/Resource';
import {Turmoil} from '../Turmoil';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.megacredits(2).slash().city().influence({size: Size.SMALL});
});

export class StrongSociety extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.STRONG_SOCIETY,
      description: 'Gain 2 M€ for each city tile (max 5) and influence.',
      revealedDelegate: PartyName.REDS,
      currentDelegate: PartyName.MARS,
      renderData: RENDER_DATA,
    });
  }
  public resolve(game: IGame, turmoil: Turmoil) {
    game.getPlayersInGenerationOrder().forEach((player) => {
      const amount = Math.min(5, player.game.getCitiesCount(player)) + turmoil.getPlayerInfluence(player);
      if (amount > 0) {
        player.stock.add(Resource.MEGACREDITS, amount * 2, {log: true, from: this.name});
      }
    });
  }
}
