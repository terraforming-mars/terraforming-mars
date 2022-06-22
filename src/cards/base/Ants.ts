import {IActionCard, IResourceCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {VictoryPoints} from '../ICard';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {CardResource} from '../../common/CardResource';
import {CardName} from '../../common/cards/CardName';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {RemoveResourcesFromCard} from '../../deferredActions/RemoveResourcesFromCard';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {all} from '../Options';

export class Ants extends Card implements IActionCard, IProjectCard, IResourceCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.ANTS,
      tags: [Tags.MICROBE],
      cost: 9,

      resourceType: CardResource.MICROBE,
      victoryPoints: VictoryPoints.resource(1, 2),
      requirements: CardRequirements.builder((b) => b.oxygen(4)),

      metadata: {
        cardNumber: '035',
        description: 'Requires 4% oxygen.',
        renderData: CardRenderer.builder((b) => {
          b.action('Remove 1 Microbe from any card to add 1 to this card.', (eb) => {
            eb.microbes(1, {all}).startAction.microbes(1);
          }).br;
          b.vpText('1 VP per 2 Microbes on this card.');
        }),
      },
    });
  }

  public override resourceCount = 0;

  public play() {
    return undefined;
  }

  public canAct(player: Player): boolean {
    if (player.game.isSoloMode()) return true;
    return RemoveResourcesFromCard.getAvailableTargetCards(player, this.resourceType).length > 0;
  }

  public action(player: Player) {
    player.game.defer(new RemoveResourcesFromCard(player, CardResource.MICROBE));
    player.game.defer(new AddResourcesToCard(player, CardResource.MICROBE, {filter: (c) => c.name === this.name}));
    return undefined;
  }
}
