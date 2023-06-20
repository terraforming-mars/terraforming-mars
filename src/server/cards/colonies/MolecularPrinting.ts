import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Size} from '../../../common/cards/render/Size';
import {Resource} from '../../../common/Resource';
import {all} from '../Options';

export class MolecularPrinting extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 11,
      tags: [Tag.SCIENCE],
      name: CardName.MOLECULAR_PRINTING,
      type: CardType.AUTOMATED,
      victoryPoints: 1,

      metadata: {
        cardNumber: 'C27',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(1).slash().city({size: Size.SMALL, all}).br;
          b.megacredits(1).slash().colonies(1, {size: Size.SMALL, all});
        }),
        description: 'Gain 1 M€ for each city tile in play. Gain 1 M€ for each colony in play.',
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    let coloniesCount = 0;
    player.game.colonies.forEach((colony) => {
      coloniesCount += colony.colonies.length;
    });
    player.stock.add(Resource.MEGACREDITS, player.game.getCitiesCount() + coloniesCount, {log: true});
    return undefined;
  }
}
