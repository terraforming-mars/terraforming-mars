import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class AlgaeBioreactors extends Card {
  constructor() {
    super({
      name: CardName.ALGAE_BIOREACTORS,
      cardType: CardType.AUTOMATED,
      tags: [Tag.PLANT],
      cost: 9,
      productionBox: {plants: -1},
      tr: {moonColony: 1, oxygen: 1},

      metadata: {
        description: 'Decrease your plant production 1 step. Raise the Colony Rate 1 step and oxygen 1%.',
        cardNumber: 'M47',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.minus().plants(1)).moonColonyRate().oxygen(1);
        }),
      },
    });
  }

  public override bespokePlay(player: Player) {
    MoonExpansion.raiseColonyRate(player);
    player.game.increaseOxygenLevel(player, 1);
    return undefined;
  }
}
