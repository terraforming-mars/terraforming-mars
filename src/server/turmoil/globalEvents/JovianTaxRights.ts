import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEvent} from './GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {Game} from '../../Game';
import {Resources} from '../../../common/Resources';
import {Turmoil} from '../Turmoil';
import {CardRenderer} from '../../cards/render/CardRenderer';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.production((pb) => pb.megacredits(1)).slash().colonies(1).nbsp.titanium(1).slash().influence();
});

export class JovianTaxRights extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.JOVIAN_TAX_RIGHTS,
      description: 'Increase M€ production 1 step for each colony. Gain 1 titanium for each influence.',
      revealedDelegate: PartyName.SCIENTISTS,
      currentDelegate: PartyName.UNITY,
      renderData: RENDER_DATA,
    });
  }
  public resolve(game: Game, turmoil: Turmoil) {
    game.getPlayersInGenerationOrder().forEach((player) => {
      let coloniesCount = 0;
      game.colonies.forEach((colony) => {
        coloniesCount += colony.colonies.filter((owner) => owner === player.id).length;
      });
      player.production.add(Resources.MEGACREDITS, coloniesCount, {log: true, from: this.name});
      player.addResource(Resources.TITANIUM, turmoil.getPlayerInfluence(player), {log: true, from: this.name});
    });
  }
}
