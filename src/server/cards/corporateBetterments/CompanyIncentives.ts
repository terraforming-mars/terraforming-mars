import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {Size} from '../../../common/cards/render/Size';

export class CompanyIncentives extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.COMPANY_INCENTIVES,
      cost: 4,
      metadata: {
        cardNumber: 'B34',
        description: 'Place 5 resource cubes on 3 empty areas on Mars. Players placing tiles on these areas collect an additional 5 M€.',
        renderData: CardRenderer.builder((b) => {
          b.text('Place 5 cubes on 3 areas. +5 M€ bonus when tiles placed there.', Size.SMALL, false);
        }),
      },
    });
  }

  public override play(_player: IPlayer) {
    // TODO: Select 3 empty spaces, set space.adjacency = {bonus: [MEGACREDITS (5)]}
    // using the AdjacencyBonus system in src/server/ares/
    return undefined;
  }
}
