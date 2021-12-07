import {IGlobalEvent, GlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from './GlobalEventName';
import {PartyName} from '../parties/PartyName';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {Tags} from '../../cards/Tags';
import {Turmoil} from '../Turmoil';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../cards/render/Size';
import {played} from '../../cards/Options';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.minus().titanium(1).slash().jovian({played}).influence({size: Size.SMALL});
});

export class MinersOnStrike extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.MINERS_ON_STRIKE,
      description: 'Lose 1 titanium for each Jovian tag (max 5, then reduced by influence).',
      revealedDelegate: PartyName.MARS,
      currentDelegate: PartyName.GREENS,
      renderData: RENDER_DATA,
    });
  }
  public resolve(game: Game, turmoil: Turmoil) {
    game.getPlayers().forEach((player) => {
      const amount = Math.min(5, player.getTagCount(Tags.JOVIAN, 'raw')) - turmoil.getPlayerInfluence(player);
      if (amount > 0) {
        player.deductResource(Resources.TITANIUM, amount, {log: true, from: this.name});
      }
    });
  }
}
