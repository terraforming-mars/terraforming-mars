import {IGlobalEvent, GlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from '../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../common/turmoil/PartyName';
import {Game} from '../../Game';
import {Turmoil} from '../Turmoil';
import {Tags} from '../../common/cards/Tags';
import {Resources} from '../../common/Resources';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../cards/render/Size';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.minus().plants(2).slash().earth(1, {played: true}).influence({size: Size.SMALL});
});

export class TiredEarth extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.TIRED_EARTH,
      description: 'Lose 1 plant for each Earth tag you own (max 5) then reduced by influence.',
      revealedDelegate: PartyName.KELVINISTS,
      currentDelegate: PartyName.GREENS,
      renderData: RENDER_DATA,
    });
  }

  public resolve(game: Game, turmoil: Turmoil) {
    game.getPlayersInGenerationOrder().forEach((player) => {
      const tags = player.getTagCount(Tags.EARTH, 'raw');
      const rawTotal = Math.min(tags, 5) - turmoil.getPlayerInfluence(player);
      const total = Math.max(rawTotal, 0);
      player.deductResource(Resources.PLANTS, total, {log: true, from: this.name});
    });
  }
}
