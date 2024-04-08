import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {UnderworldExpansion} from '../../underworld/UnderworldExpansion';
import {Resource} from '../../../common/Resource';

export class PrivateResorts extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.PRIVATE_RESORTS,
      type: CardType.AUTOMATED,
      cost: 6,
      tags: [Tag.BUILDING],

      requirements: {oceans: 3},

      behavior: {
        production: {heat: -1},
        underworld: {markThisGeneration: {}},
      },

      metadata: {
        cardNumber: 'U54',
        renderData: CardRenderer.builder((b) => {
          b.minus().production((pb) => pb.heat(1)).br;
          b.megacredits(12).asterix().corruption(1).asterix();
        }),
        description: 'Requires 3 oceans. Reduce your heat production 1 step. ' +
          'At the end of this generation only, during the production phase, gain 12 M€ and 1 corruption.',
      },
    });
  }

  public generationUsed: number = -1;

  public onProductionPhase(player: IPlayer) {
    if (this.generationUsed === player.game.generation) {
      player.stock.add(Resource.MEGACREDITS, 12);
      UnderworldExpansion.gainCorruption(player, 1);
    }
    return undefined;
  }
}
