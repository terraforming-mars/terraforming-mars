import { IGlobalEvent } from './IGlobalEvent';
import { GlobalEventName } from './GlobalEventName';
import { PartyName } from '../parties/PartyName';
import { Game } from '../../Game';
import { Turmoil } from '../Turmoil';
import { RemoveOcean } from '../../interrupts/RemoveOcean';
import { SelectResources } from '../../interrupts/SelectResources';

export class DryDeserts implements IGlobalEvent {
    public name = GlobalEventName.DRY_DESERTS;
    public description = "First player removes 1 ocean tile from the gameboard. Gain 1 standard resource per influence.";
    public revealedDelegate = PartyName.REDS;
    public currentDelegate = PartyName.UNITY;
    public resolve(game: Game, turmoil: Turmoil) {
        if (game.board.getOceansOnBoard() > 0) {
            game.addInterrupt(new RemoveOcean(game.getPlayers()[0], game, 'Dry Deserts Global Event - Remove an Ocean tile from the board'));
        }

        game.getPlayers().forEach(player => {
            if (turmoil.getPlayerInfluence(player) > 0) {
                let selectResources = new SelectResources(player, game, turmoil.getPlayerInfluence(player));
                selectResources.playerInput.title = "Dry Deserts Global Event - Gain " +  turmoil.getPlayerInfluence(player) + " resource(s) for influence";
                game.addInterrupt(selectResources);
            }            
        });    
    }
}