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
  b.steel(1).slash().production((pb) => pb.steel(1)).nbsp.influence({size: Size.SMALL});
});

export class Productivity extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.PRODUCTIVITY,
      description: 'Gain 1 steel for each steel production (max 5) and influence.',
      revealedDelegate: PartyName.SCIENTISTS,
      currentDelegate: PartyName.MARS,
      renderData: RENDER_DATA,
    });
  }
  public resolve(game: IGame, turmoil: Turmoil) {
    game.getPlayersInGenerationOrder().forEach((player) => {
      player.stock.add(Resource.STEEL, Math.min(5, player.production.steel) + turmoil.getPlayerInfluence(player), {log: true, from: this.name});
    });
  }
}
