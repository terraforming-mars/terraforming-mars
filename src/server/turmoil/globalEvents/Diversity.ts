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
  b.text('9').diverseTag(1).influence({size: Size.SMALL}).colon().megacredits(10);
});

export class Diversity extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.DIVERSITY,
      description: 'Gain 10 M€ if you have 9 or more different tags. Influence counts as unique tags.',
      revealedDelegate: PartyName.SCIENTISTS,
      currentDelegate: PartyName.SCIENTISTS,
      renderData: RENDER_DATA,
    });
  }
  public resolve(game: IGame, turmoil: Turmoil) {
    game.getPlayersInGenerationOrder().forEach((player) => {
      if (player.tags.distinctCount('globalEvent') + turmoil.getPlayerInfluence(player) >= 9) {
        player.stock.add(Resource.MEGACREDITS, 10, {log: true, from: this.name});
      }
    });
  }
}
