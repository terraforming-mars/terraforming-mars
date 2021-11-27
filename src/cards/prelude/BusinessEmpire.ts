import {Tags} from '../Tags';
import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {CardName} from '../../CardName';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';

export class BusinessEmpire extends PreludeCard {
  constructor() {
    super({
      name: CardName.BUSINESS_EMPIRE,
      tags: [Tags.EARTH],

      productionBox: Units.of({megacredits: 6}),
      startingMegacredits: -6,

      metadata: {
        cardNumber: 'P06',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(6)).br;
          b.megacredits(-6);
        }),
        description: 'Increase your M€ production 6 steps. Pay 6 M€.',
      },
    });
  }
  public canPlay(player: Player) {
    if (player.isCorporation(CardName.MANUTECH)) return true;
    return player.canAfford(6);
  }
  public play(player: Player) {
    player.adjustProduction(this.productionBox);
    player.game.defer(new SelectHowToPayDeferred(player, 6));
    return undefined;
  }
}

