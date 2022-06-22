import {IGlobalEvent, GlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from '../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../common/turmoil/PartyName';
import {Game} from '../../Game';
import {Resources} from '../../common/Resources';
import {Turmoil} from '../Turmoil';
import {Tags} from '../../common/cards/Tags';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../common/cards/render/Size';
import {played} from '../../cards/Options';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.minus().megacredits(3).slash().space({played}).influence({size: Size.SMALL});
});

export class SolarFlare extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.SOLAR_FLARE,
      description: 'Lose 3 M€ for each space tag (max 5, then reduced by influence).',
      revealedDelegate: PartyName.UNITY,
      currentDelegate: PartyName.KELVINISTS,
      renderData: RENDER_DATA,
    });
  }
  public resolve(game: Game, turmoil: Turmoil) {
    game.getPlayersInGenerationOrder().forEach((player) => {
      const amount = Math.min(5, player.getTagCount(Tags.SPACE, 'raw')) - turmoil.getPlayerInfluence(player);
      if (amount > 0) {
        player.deductResource(Resources.MEGACREDITS, amount * 3, {log: true, from: this.name});
      }
    });
  }
}
