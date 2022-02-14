import {IGlobalEvent, GlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from '../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../common/turmoil/PartyName';
import {Game} from '../../Game';
import {Resources} from '../../common/Resources';
import {Turmoil} from '../Turmoil';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../cards/render/Size';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.production((pb) => pb.minus().energy(1).steel(1)).br;
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
      if (player.getProduction(Resources.ENERGY) >= 1) {
        player.addProduction(Resources.ENERGY, -1, {log: true, from: this.name});
      }
      if (player.getProduction(Resources.STEEL) >= 1) {
        player.addProduction(Resources.STEEL, -1, {log: true, from: this.name});
      }
      player.addResource(Resources.STEEL, turmoil.getPlayerInfluence(player), {log: true, from: this.name});
    });
  }
}
