import { IGlobalEvent } from './IGlobalEvent';
import { GlobalEventName } from './GlobalEventName';
import { PartyName } from '../parties/PartyName';
import { Game } from '../../Game';
import { Resources } from '../../Resources';
import { Tags } from '../../cards/Tags';
import { Turmoil } from '../Turmoil';

export class ImprovedEnergyTemplates implements IGlobalEvent {
    public name = GlobalEventName.IMPROVED_ENERGY_TEMPLATES
    public description = "Increase energy production 1 step per 2 power tags (no limit). Influence counts as power tags.";
    public revealedDelegate = PartyName.SCIENTISTS;
    public currentDelegate = PartyName.KELVINISTS;
    public resolve(game: Game, turmoil: Turmoil) {
        game.getPlayers().forEach(player => {
            player.setProduction(Resources.ENERGY, Math.floor((player.getTagCount(Tags.ENERGY, false, false) + turmoil.getPlayerInfluence(player)) / 2), game, undefined, true);
        });    
    }
}    