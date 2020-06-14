import { IGlobalEvent } from './IGlobalEvent';
import { GlobalEventName } from './GlobalEventName';
import { PartyName } from '../parties/PartyName';
import { Game } from '../../Game';
import { Resources } from '../../Resources';
import { Tags } from '../../cards/Tags';
import { Turmoil } from '../Turmoil';

export class AsteroidMining implements IGlobalEvent {
    public name = GlobalEventName.ASTEROID_MINING;
    public description = "Gain 1 titanium for each Jovian tag (max 5) and influence.";
    public revealedDelegate = PartyName.REDS;
    public currentDelegate = PartyName.UNITY;
    public resolve(game: Game, turmoil: Turmoil) {
        game.getPlayers().forEach(player => {
            player.setResource(Resources.TITANIUM, Math.min(5, player.getTagCount(Tags.JOVIAN, false, false)) + turmoil.getPlayerInfluence(player), game, undefined, true);
        });    
    }
}    