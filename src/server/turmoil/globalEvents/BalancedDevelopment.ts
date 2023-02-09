import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEvent} from './GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {Game} from '../../Game';
import {Turmoil} from '../Turmoil';
import {Tag} from '../../../common/cards/Tag';
import {Resources} from '../../../common/Resources';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.megacredits(2).slash().mars(1, {played: true}).influence({size: Size.SMALL});
});

export class BalancedDevelopment extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.BALANCED_DEVELOPMENT,
      description: 'Gain 2M€ for each Mars tag you have (max 5) and influence.',
      revealedDelegate: PartyName.UNITY,
      currentDelegate: PartyName.MARS,
      renderData: RENDER_DATA,
    });
  }

  public resolve(game: Game, turmoil: Turmoil) {
    game.getPlayersInGenerationOrder().forEach((player) => {
      const tags = player.tags.count(Tag.MARS, 'raw');
      const total = Math.min(tags, 5) + turmoil.getPlayerInfluence(player);
      player.addResource(Resources.MEGACREDITS, 2 * total, {log: true, from: this.name});
    });
  }
}
