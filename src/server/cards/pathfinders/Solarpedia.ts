import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {CardResource} from '../../../common/CardResource';
import {IActionCard, VictoryPoints} from '../ICard';
import {Card} from '../Card';
import {CardRequirements} from '../CardRequirements';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';

export class Solarpedia extends Card implements IProjectCard, IActionCard {
  constructor() {
    super({
      name: CardName.SOLARPEDIA,
      cardType: CardType.ACTIVE,
      tags: [Tag.SPACE],
      cost: 12,
      requirements: CardRequirements.builder((b) => b.tag(Tag.VENUS).tag(Tag.EARTH).tag(Tag.MARS).tag(Tag.JOVIAN)),
      resourceType: CardResource.DATA,
      victoryPoints: VictoryPoints.resource(1, 6),

      behavior: {
        addResourcesToAnyCard: {type: CardResource.DATA, count: 2},
      },

      metadata: {
        cardNumber: 'Pf54',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 2 data to ANY card.', (ab) => {
            ab.empty().startAction.data({amount: 2}).asterix();
          }).br;
          b.data({amount: 2}).asterix();
        }),
        description: 'Requires 1 Venus, Earth, Mars, and Jovian Tag. Add 2 data to ANY card. 1 VP for every 6 data resources here.',
      },
    });
  }

  public canAct() {
    return true;
  }

  public action(player: Player) {
    player.game.defer(new AddResourcesToCard(player, CardResource.DATA, {count: 2}));
    return undefined;
  }
}
