import {IGlobalEvent, GlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from '../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../common/turmoil/PartyName';
import {Game} from '../../Game';
import {Resources} from '../../common/Resources';
import {Turmoil} from '../Turmoil';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../common/cards/render/Size';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.vSpace().br.plants(1).slash().production((pb) => pb.plants(1)).nbsp.influence({size: Size.SMALL});
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
    game.getPlayersInGenerationOrder().forEach((player) => {
      player.addResource(Resources.PLANTS, Math.min(5, player.getProduction(Resources.PLANTS)) + turmoil.getPlayerInfluence(player), {log: true, from: this.name});
    });
  }
}
