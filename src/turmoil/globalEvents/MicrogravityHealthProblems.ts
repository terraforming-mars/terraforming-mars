import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from './GlobalEventName';
import {PartyName} from '../parties/PartyName';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {Turmoil} from '../Turmoil';

export class MicrogravityHealthProblems implements IGlobalEvent {
    public name = GlobalEventName.MICROGRAVITY_HEALTH_PROBLEMS;
    public description = 'Lose 3 M€ for each colony (max 5, then reduced by influence).';
    public revealedDelegate = PartyName.MARS;
    public currentDelegate = PartyName.SCIENTISTS;
    public resolve(game: Game, turmoil: Turmoil) {
      game.getPlayers().forEach((player) => {
        let coloniesCount: number = 0;
        game.colonies.forEach((colony) => {
          coloniesCount += colony.colonies.filter((owner) => owner === player.id).length;
        });
        player.deductResource(Resources.MEGACREDITS, 3 * Math.max(0, Math.min(5, coloniesCount) - turmoil.getPlayerInfluence(player)), {log: true, from: this.name});
      });
    }
}
