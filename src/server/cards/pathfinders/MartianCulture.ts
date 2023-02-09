import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {IActionCard, VictoryPoints} from '../ICard';
import {CardRequirements} from '../CardRequirements';
import {Tag} from '../../../common/cards/Tag';
import {CardResource} from '../../../common/CardResource';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {all} from '../Options';

export class MartianCulture extends Card implements IProjectCard, IActionCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.MARTIAN_CULTURE,
      cost: 11,
      tags: [Tag.MARS, Tag.MARS],
      resourceType: CardResource.DATA,
      requirements: CardRequirements.builder((b) => b.tag(Tag.MARS, 2, {all})),
      victoryPoints: VictoryPoints.resource(1, 2),

      metadata: {
        cardNumber: 'Pf35',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 data to ANY card.', (eb) => eb.empty().startAction.data({amount: 1}).asterix());
        }),
        description: 'Requires any 2 Mars tags in play.  1 VP for every 2 data here.',
      },
    });
  }

  public canAct() {
    return true;
  }

  public action(player: Player) {
    player.game.defer(new AddResourcesToCard(player, CardResource.DATA));
    return undefined;
  }
}

