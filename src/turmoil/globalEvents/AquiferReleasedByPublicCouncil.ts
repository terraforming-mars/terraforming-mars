import { IGlobalEvent } from './IGlobalEvent';
import { GlobalEventName } from './GlobalEventName';
import { PartyName } from '../parties/PartyName';
import { Game } from '../../Game';
import { Resources } from '../../Resources';
import { Turmoil } from '../Turmoil';

export class AquiferReleasedByPublicCouncil implements IGlobalEvent {
    public name = GlobalEventName.AQUIFER_RELEASED_BY_PUBLIC_COUNCIL;
    public description = "First player places an ocean tile. Gain 1 plant and 1 steel per influence.";
    public revealedDelegate = PartyName.MARS;
    public currentDelegate = PartyName.GREENS;
    public resolve(game: Game, turmoil: Turmoil) {
        game.addOceanInterrupt(game.getPlayers()[0],"Select Ocean for Global Event",true);
        game.getPlayers().forEach(player => {
            player.setResource(Resources.PLANTS, turmoil.getPlayerInfluence(player), game, undefined, true);
            player.setResource(Resources.STEEL, turmoil.getPlayerInfluence(player), game, undefined, true);
        });    
    }
}    