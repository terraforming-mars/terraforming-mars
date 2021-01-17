import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {PreludeCard} from './PreludeCard';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';
import {CardRenderer} from '../render/CardRenderer';

export class AquiferTurbines extends PreludeCard {
  constructor() {
    super({
      name: CardName.AQUIFER_TURBINES,
      tags: [Tags.ENERGY],

      metadata: {
        cardNumber: 'P02',
        renderData: CardRenderer.builder((b) => {
          b.oceans(1).production((pb) => pb.energy(2)).br;
          b.megacredits(-3);
        }),
        description: 'Place an Ocean. Increase your energy production 2 steps. Pay 3 MC.',
      },
    });
  }
  public canPlay(player: Player, _game: Game) {
    return player.canAfford(3);
  }
  public play(player: Player, game: Game) {
    player.addProduction(Resources.ENERGY, 2);
    game.defer(new PlaceOceanTile(player));
    game.defer(new SelectHowToPayDeferred(player, 3));
    return undefined;
  }
}

