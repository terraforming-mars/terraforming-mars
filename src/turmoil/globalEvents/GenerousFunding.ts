import {IGlobalEvent, GlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from './GlobalEventName';
import {PartyName} from '../parties/PartyName';
import {Game} from '../../Game';
import {Resources} from '../../common/Resources';
import {Turmoil} from '../Turmoil';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {digit} from '../../cards/Options';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.megacredits(2).slash().influence().plus().tr(5, {digit, over: 15}).br.br;
});

export class GenerousFunding extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.GENEROUS_FUNDING,
      description: 'Gain 2 M€ for each influence and set of 5 TR over 15 (max 5 sets).',
      revealedDelegate: PartyName.KELVINISTS,
      currentDelegate: PartyName.UNITY,
      renderData: RENDER_DATA,
    });
  }

  public resolve(game: Game, turmoil: Turmoil) {
    game.getPlayers().forEach((player) => {
      const trSets = Math.max(0, Math.floor((player.getTerraformRating() - 15) / 5));
      const maxTRSets = 5;
      const totalSets = Math.min(maxTRSets, trSets) + turmoil.getPlayerInfluence(player);
      player.addResource(Resources.MEGACREDITS, 2 * totalSets, {log: true, from: this.name});
    });
  }
}
