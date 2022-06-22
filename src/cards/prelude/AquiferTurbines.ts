import {Tags} from '../../common/cards/Tags';
import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {CardName} from '../../common/cards/CardName';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../common/Units';

export class AquiferTurbines extends PreludeCard {
  constructor() {
    super({
      name: CardName.AQUIFER_TURBINES,
      tags: [Tags.ENERGY],

      productionBox: Units.of({energy: 2}),
      startingMegacredits: -3,

      metadata: {
        cardNumber: 'P02',
        renderData: CardRenderer.builder((b) => {
          b.oceans(1).production((pb) => pb.energy(2)).br;
          b.megacredits(-3);
        }),
        description: 'Place an Ocean tile. Increase your energy production 2 steps. Pay 3 M€.',
      },
    });
  }
  public override canPlay(player: Player) {
    return player.canAfford(3);
  }
  public play(player: Player) {
    player.adjustProduction(this.productionBox);
    player.game.defer(new PlaceOceanTile(player));
    player.game.defer(new SelectHowToPayDeferred(player, 3));
    return undefined;
  }
}

