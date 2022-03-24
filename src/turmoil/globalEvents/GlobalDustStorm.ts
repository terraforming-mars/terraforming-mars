import {IGlobalEvent, GlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from '../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../common/turmoil/PartyName';
import {Game} from '../../Game';
import {Resources} from '../../common/Resources';
import {Tags} from '../../common/cards/Tags';
import {Turmoil} from '../Turmoil';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../common/cards/render/Size';
import {played} from '../../cards/Options';


const RENDER_DATA = CardRenderer.builder((b) => {
  b.text('lose all').heat(1).br.megacredits(-2).slash().building(1, {played}).influence({size: Size.SMALL});
});

export class GlobalDustStorm extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.GLOBAL_DUST_STORM,
      description: 'Lose all heat. Lose 2 M€ for each Building tag (max 5, then reduced by influence).',
      revealedDelegate: PartyName.KELVINISTS,
      currentDelegate: PartyName.GREENS,
      renderData: RENDER_DATA,
    });
  }
  public resolve(game: Game, turmoil: Turmoil): void {
    game.getPlayersInGenerationOrder().forEach((player) => {
      if (player.heat > 0) {
        player.deductResource(Resources.HEAT, player.heat, {log: true, from: this.name});
      }
      const maxedSteelTags = Math.min(5, player.getTagCount(Tags.BUILDING, 'raw'));
      player.deductResource(Resources.MEGACREDITS, 2 * Math.max(0, maxedSteelTags - turmoil.getPlayerInfluence(player)), {log: true, from: this.name});
    });
  }
}
