import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEvent} from './GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {Game} from '../../Game';
import {Resources} from '../../../common/Resources';
import {Turmoil} from '../Turmoil';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.br.production((pb) => pb.minus().energy(1).steel(1)).nbsp.nbsp;
  b.steel(1).slash().nbsp.influence({size: Size.SMALL});
});

export class Sabotage extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.SABOTAGE,
      description: 'Decrease steel and energy production 1 step each. Gain 1 steel per influence.',
      revealedDelegate: PartyName.UNITY,
      currentDelegate: PartyName.REDS,
      renderData: RENDER_DATA,
    });
  }
  public resolve(game: Game, turmoil: Turmoil) {
    game.getPlayersInGenerationOrder().forEach((player) => {
      // This conditional isn't to prevent negative production, but to prevent misleading logging when the production diff is zero.
      if (player.production.energy >= 1) {
        player.production.add(Resources.ENERGY, -1, {log: true, from: this.name});
      }
      if (player.production.steel >= 1) {
        player.production.add(Resources.STEEL, -1, {log: true, from: this.name});
      }
      player.addResource(Resources.STEEL, turmoil.getPlayerInfluence(player), {log: true, from: this.name});
    });
  }
}
