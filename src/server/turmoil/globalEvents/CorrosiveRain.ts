import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEvent} from './GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {IGame} from '../../IGame';
import {Turmoil} from '../Turmoil';
import {CorrosiveRainDeferredAction} from '../../deferredActions/CorrosiveRainDeferredAction';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {CardResource} from '../../../common/CardResource';

export class CorrosiveRain extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.CORROSIVE_RAIN,
      description: 'Lose 2 floaters from a card or 10 M€. Draw 1 card for each influence.',
      revealedDelegate: PartyName.KELVINISTS,
      currentDelegate: PartyName.GREENS,
      renderData: CardRenderer.builder((b) => {
        b.minus().resource(CardResource.FLOATER, 2).or().megacredits(-10).nbsp.nbsp.cards(1).slash().influence();
      }),
    });
  }

  public override bespokeResolve(game: IGame) {
    const turmoil = Turmoil.getTurmoil(game);
    game.playersInGenerationOrder.forEach((player) => {
      player.drawCard(turmoil.getInfluence(player));
      game.defer(new CorrosiveRainDeferredAction(player));
    });
  }
}
