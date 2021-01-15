import {Tags} from '../Tags';
import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';
import {CardRenderer} from '../../cards/render/CardRenderer';

export class GalileanMining extends PreludeCard {
  constructor() {
    super({
      name: CardName.GALILEAN_MINING,
      tags: [Tags.JOVIAN],

      metadata: {
        cardNumber: 'P13',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.titanium(2);
          }).br;
          b.megacredits(-5);
        }),
        description: 'Increase your titanium production 2 steps. Pay 5 MC.',
      },
    });
  }
  public canPlay(player: Player, _game: Game) {
    return player.canAfford(5);
  }
  public play(player: Player, game: Game) {
    player.addProduction(Resources.TITANIUM, 2);
    game.defer(new SelectHowToPayDeferred(player, 5));
    return undefined;
  }
}
