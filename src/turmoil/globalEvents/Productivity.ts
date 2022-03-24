import {IGlobalEvent, GlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from '../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../common/turmoil/PartyName';
import {Game} from '../../Game';
import {Resources} from '../../common/Resources';
import {Turmoil} from '../Turmoil';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../common/cards/render/Size';

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
  public resolve(game: Game, turmoil: Turmoil) {
    game.getPlayersInGenerationOrder().forEach((player) => {
      player.addResource(Resources.STEEL, Math.min(5, player.getProduction(Resources.STEEL)) + turmoil.getPlayerInfluence(player), {log: true, from: this.name});
    });
  }
}
