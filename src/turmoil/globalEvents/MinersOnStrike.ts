import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from './GlobalEventName';
import {PartyName} from '../parties/PartyName';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {Tags} from '../../cards/Tags';
import {Turmoil} from '../Turmoil';

export class MinersOnStrike implements IGlobalEvent {
    public name = GlobalEventName.MINERS_ON_STRIKE;
    public description = 'Lose 1 titanium for each Jovian tag (max 5, then reduced by influence).';
    public revealedDelegate = PartyName.MARS;
    public currentDelegate = PartyName.GREENS;
    public resolve(game: Game, turmoil: Turmoil) {
      game.getPlayers().forEach((player) => {
        const amount = Math.min(5, player.getTagCount(Tags.JOVIAN, false, false)) - turmoil.getPlayerInfluence(player);
        if (amount > 0) {
          player.deductResource(Resources.TITANIUM, amount, {log: true, from: this.name});
        }
      });
    }
}
