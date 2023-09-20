import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEvent} from './GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {IGame} from '../../IGame';
import {Resource} from '../../../common/Resource';
import {Turmoil} from '../Turmoil';
import {CardType} from '../../../common/cards/CardType';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.minus().megacredits(3).slash().cards(1, {secondaryTag: AltSecondaryTag.BLUE}).influence({size: Size.SMALL});
});

export class SolarnetShutdown extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.SOLARNET_SHUTDOWN,
      description: 'Lose 3 M€ for each blue card (max 5, then reduced by influence).',
      revealedDelegate: PartyName.SCIENTISTS,
      currentDelegate: PartyName.MARS,
      renderData: RENDER_DATA,
    });
  }
  public resolve(game: IGame, turmoil: Turmoil) {
    game.getPlayersInGenerationOrder().forEach((player) => {
      const amount = Math.min(5, player.playedCards.filter((card) => card.type === CardType.ACTIVE).length) - turmoil.getPlayerInfluence(player);
      if (amount > 0) {
        player.stock.deduct(Resource.MEGACREDITS, amount * 3, {log: true, from: this.name});
      }
    });
  }
}
