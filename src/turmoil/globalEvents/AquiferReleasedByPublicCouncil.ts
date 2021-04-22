import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from './GlobalEventName';
import {PartyName} from '../parties/PartyName';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {Turmoil} from '../Turmoil';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';

export class AquiferReleasedByPublicCouncil implements IGlobalEvent {
    public name = GlobalEventName.AQUIFER_RELEASED_BY_PUBLIC_COUNCIL;
    public description = 'First player places an ocean tile. Gain 1 plant and 1 steel per influence.';
    public revealedDelegate = PartyName.MARS;
    public currentDelegate = PartyName.GREENS;
    public resolve(game: Game, turmoil: Turmoil) {
      game.defer(new PlaceOceanTile(game.getPlayers()[0], 'Select Ocean for Global Event'));
      game.getPlayers().forEach((player) => {
        player.addResource(Resources.PLANTS, turmoil.getPlayerInfluence(player), {log: true, from: GlobalEventName.CORROSIVE_RAIN});
        player.addResource(Resources.STEEL, turmoil.getPlayerInfluence(player), {log: true, from: GlobalEventName.CORROSIVE_RAIN});
      });
    }
}
