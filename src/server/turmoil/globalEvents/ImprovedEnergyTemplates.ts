import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEvent} from './GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {IGame} from '../../IGame';
import {Resource} from '../../../common/Resource';
import {Tag} from '../../../common/cards/Tag';
import {Turmoil} from '../Turmoil';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.production((pb) => pb.energy(1)).slash().tag(Tag.POWER, 2).influence({size: Size.SMALL});
});

export class ImprovedEnergyTemplates extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.IMPROVED_ENERGY_TEMPLATES,
      description: 'Increase energy production 1 step per 2 power tags (no limit). Influence counts as power tags.',
      revealedDelegate: PartyName.SCIENTISTS,
      currentDelegate: PartyName.KELVINISTS,
      renderData: RENDER_DATA,
    });
  }
  public resolve(game: IGame, turmoil: Turmoil) {
    game.getPlayersInGenerationOrder().forEach((player) => {
      player.production.add(Resource.ENERGY, Math.floor((player.tags.count(Tag.POWER, 'raw') + turmoil.getPlayerInfluence(player)) / 2), {log: true, from: this.name});
    });
  }
}
