import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEvent} from './GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {Game} from '../../Game';
import {Resources} from '../../../common/Resources';
import {Turmoil} from '../Turmoil';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.megacredits(1).slash().cards(1).influence({size: Size.SMALL});
});

export class ScientificCommunity extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.SCIENTIFIC_COMMUNITY,
      description: 'Gain 1 M€ for each card in hand (no limit) and influence.',
      revealedDelegate: PartyName.REDS,
      currentDelegate: PartyName.SCIENTISTS,
      renderData: RENDER_DATA,
    });
  }
  public resolve(game: Game, turmoil: Turmoil) {
    game.getPlayersInGenerationOrder().forEach((player) => {
      const amount = player.cardsInHand.length + turmoil.getPlayerInfluence(player);
      player.addResource(Resources.MEGACREDITS, amount, {log: true, from: this.name});
    });
  }
}
