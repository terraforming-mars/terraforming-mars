import {Tags} from '../../common/cards/Tags';
import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';
import {CardRenderer} from '../../cards/render/CardRenderer';

export class GalileanMining extends PreludeCard {
  constructor() {
    super({
      name: CardName.GALILEAN_MINING,
      tags: [Tags.JOVIAN],

      startingMegacredits: -5,

      metadata: {
        cardNumber: 'P13',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.titanium(2);
          }).br;
          b.megacredits(-5);
        }),
        description: 'Increase your titanium production 2 steps. Pay 5 M€.',
      },
    });
  }
  public override canPlay(player: Player) {
    return player.canAfford(5);
  }
  public play(player: Player) {
    player.addProduction(Resources.TITANIUM, 2);
    player.game.defer(new SelectHowToPayDeferred(player, 5));
    return undefined;
  }
}
