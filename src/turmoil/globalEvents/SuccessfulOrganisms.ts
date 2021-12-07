import {IGlobalEvent, GlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from './GlobalEventName';
import {PartyName} from '../parties/PartyName';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {Turmoil} from '../Turmoil';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../cards/render/Size';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.plants(1).slash().production((pb) => pb.plants(1)).nbsp.influence({size: Size.SMALL});
});


export class SuccessfulOrganisms extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.SUCCESSFUL_ORGANISMS,
      description: 'Gain 1 plant per plant production (max 5) and influence.',
      revealedDelegate: PartyName.MARS,
      currentDelegate: PartyName.SCIENTISTS,
      renderData: RENDER_DATA,
    });
  }
  public resolve(game: Game, turmoil: Turmoil) {
    game.getPlayers().forEach((player) => {
      player.addResource(Resources.PLANTS, Math.min(5, player.getProduction(Resources.PLANTS)) + turmoil.getPlayerInfluence(player), {log: true, from: this.name});
    });
  }
}
