import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {Size} from '../../../common/cards/render/Size';

export class MartianSamples extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.MARTIAN_SAMPLES,
      tags: [Tag.MARS],
      cost: 6,
      requirements: {oxygen: 4, max: true},
      metadata: {
        cardNumber: 'B46',
        description: 'Requires at most 4% Oxygen. Reserve 3 empty Mars areas for your exclusive use. Collect a bonus resource cube when you place a tile on these areas.',
        renderData: CardRenderer.builder((b) => {
          b.text('Reserve 3 areas. Bonus resource on placement.', Size.SMALL, false);
        }),
      },
    });
  }

  public override play(_player: IPlayer) {
    // TODO: Select 3 empty unreserved Mars spaces, mark them as reserved for this player.
    // On tile placement there by this player, grant 1 standard resource.
    // Requires AdjacencyBonus / space reservation system.
    return undefined;
  }
}
