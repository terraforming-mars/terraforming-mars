import { IGlobalEvent } from './IGlobalEvent';
import { GlobalEventName } from './GlobalEventName';
import { PartyName } from '../parties/PartyName';
import { Game } from '../../Game';
import { Resources } from '../../Resources';
import { Tags } from '../../cards/Tags';
import { Turmoil } from '../Turmoil';

export class SucessfulOrganisms implements IGlobalEvent {
    public name = GlobalEventName.SUCESSFUL_ORGANISMS;
    public revealedDelegate = PartyName.MARS;
    public currentDelegate = PartyName.SCIENTISTS;
    public resolve(game: Game, turmoil: Turmoil) {
        game.getPlayers().forEach(player => {
            player.setResource(Resources.PLANTS, Math.min(5, player.getTagCount(Tags.PLANT, false, false)) + turmoil.getPlayerInfluence(player), undefined, undefined, true);
        });    
    }
}    