import {CardName} from '../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../common/cards/CardType';
import {Tags} from '../../common/cards/Tags';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../common/Units';
import {MoonCard} from './MoonCard';

export class AlgaeBioreactors extends MoonCard {
  constructor() {
    super({
      name: CardName.ALGAE_BIOREACTORS,
      cardType: CardType.AUTOMATED,
      tags: [Tags.PLANT],
      cost: 9,
      productionBox: Units.of({plants: -1}),
      tr: {moonColony: 1, oxygen: 1},

      metadata: {
        description: 'Decrease your plant production 1 step. Raise the Colony Rate 1 step and oxygen 1%.',
        cardNumber: 'M47',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.minus().plants(1)).moonColonyRate().oxygen(1);
        }),
      },
    }, {
    });
  }

  public override play(player: Player) {
    super.play(player);
    MoonExpansion.raiseColonyRate(player);
    player.game.increaseOxygenLevel(player, 1);
    return undefined;
  }
}
