import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEvent} from './GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {IGame} from '../../IGame';
import {Resource} from '../../../common/Resource';
import {Turmoil} from '../Turmoil';
import {CardRenderer} from '../../cards/render/CardRenderer';

export class JovianTaxRights extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.JOVIAN_TAX_RIGHTS,
      description: 'Increase M€ production 1 step for each colony. Gain 1 titanium for each influence.',
      revealedDelegate: PartyName.SCIENTISTS,
      currentDelegate: PartyName.UNITY,
      renderData: CardRenderer.builder((b) => {
        b.production((pb) => pb.megacredits(1)).slash().colonies(1).nbsp.titanium(1).slash().influence();
      }),
    });
  }
  public resolve(game: IGame, turmoil: Turmoil) {
    game.playersInGenerationOrder.forEach((player) => {
      let coloniesCount = 0;
      game.colonies.forEach((colony) => {
        coloniesCount += colony.colonies.filter((owner) => owner === player.id).length;
      });
      player.production.add(Resource.MEGACREDITS, coloniesCount, {log: true, from: {globalEvent: this}});
      player.stock.add(Resource.TITANIUM, turmoil.getInfluence(player), {log: true, from: {globalEvent: this}});
    });
  }
}
