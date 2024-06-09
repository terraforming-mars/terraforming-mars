import {IGlobalEvent} from '../../turmoil/globalEvents/IGlobalEvent';
import {GlobalEvent} from '../../turmoil/globalEvents/GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {IGame} from '../../IGame';
import {Turmoil} from '../../turmoil/Turmoil';
import {Tag} from '../../../common/cards/Tag';
import {Resource} from '../../../common/Resource';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.minus().plants(1).slash().tag(Tag.EARTH).influence({size: Size.SMALL});
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

  public resolve(game: IGame, turmoil: Turmoil) {
    game.getPlayersInGenerationOrder().forEach((player) => {
      const tags = player.tags.count(Tag.EARTH, 'raw');
      const rawTotal = Math.min(tags, 5) - turmoil.getPlayerInfluence(player);
      const total = Math.max(rawTotal, 0);
      player.stock.deduct(Resource.PLANTS, total, {log: true, from: this.name});
    });
  }
}
