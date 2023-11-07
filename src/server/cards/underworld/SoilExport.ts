import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {Resource} from '../../../common/Resource';

export class SoilExport extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.SOIL_EXPORT,
      type: CardType.EVENT,
      cost: 7,
      tags: [Tag.JOVIAN, Tag.VENUS, Tag.SPACE],
      victoryPoints: -1,

      behavior: {
        underworld: {
          excavate: 1,
          markThisGeneration: {},
        },
      },


      metadata: {
        cardNumber: 'U58',
        renderData: CardRenderer.builder((b) => {
          b.excavate().br;
          b.plainText('Excavate an underground resource.').br;
          b.megacredits(12).asterix().br;
          b.plainText('At the end of this generation only, during the production phase, gain 12 M€.');
        }),
      },
    });
  }

  public generationUsed: number = -1;

  public onProductionPhase(player: IPlayer) {
    if (this.generationUsed === player.game.generation) {
      player.stock.add(Resource.MEGACREDITS, 12);
    }
    return undefined;
  }
}
