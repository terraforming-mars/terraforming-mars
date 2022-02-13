import {IGlobalEvent, GlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from '../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../common/turmoil/PartyName';
import {Game} from '../../Game';
import {Resources} from '../../common/Resources';
import {Turmoil} from '../Turmoil';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {CardRenderer} from '../../cards/render/CardRenderer';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.oceans(1).nbsp.plants(1).steel(1).slash().influence();
});

export class AquiferReleasedByPublicCouncil extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.AQUIFER_RELEASED_BY_PUBLIC_COUNCIL,
      description: 'First player places an ocean tile. Gain 1 plant and 1 steel per influence.',
      revealedDelegate: PartyName.MARS,
      currentDelegate: PartyName.GREENS,
      renderData: RENDER_DATA,
    });
  }
  public resolve(game: Game, turmoil: Turmoil) {
    game.defer(new PlaceOceanTile(game.getPlayersInGenerationOrder()[0], 'Select Ocean for Global Event'));
    game.getPlayersInGenerationOrder().forEach((player) => {
      player.addResource(Resources.PLANTS, turmoil.getPlayerInfluence(player), {log: true, from: GlobalEventName.CORROSIVE_RAIN});
      player.addResource(Resources.STEEL, turmoil.getPlayerInfluence(player), {log: true, from: GlobalEventName.CORROSIVE_RAIN});
    });
  }
}
