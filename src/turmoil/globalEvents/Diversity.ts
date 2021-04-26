import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from './GlobalEventName';
import {PartyName} from '../parties/PartyName';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {Turmoil} from '../Turmoil';

export class Diversity implements IGlobalEvent {
    public name = GlobalEventName.DIVERSITY;
    public description = 'Gain 10 M€ if you have 9 or more different tags. Influence counts as unique tags.';
    public revealedDelegate = PartyName.SCIENTISTS;
    public currentDelegate = PartyName.SCIENTISTS;
    public resolve(game: Game, turmoil: Turmoil) {
      game.getPlayers().forEach((player) => {
        if (player.getDistinctTagCount(false) + turmoil.getPlayerInfluence(player) >= 9) {
          player.addResource(Resources.MEGACREDITS, 10, {log: true, from: this.name});
        }
      });
    }
}
