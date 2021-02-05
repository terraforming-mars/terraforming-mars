import {IActionCard, IResourceCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {ResourceType} from '../../ResourceType';
import {CardName} from '../../CardName';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {RemoveResourcesFromCard} from '../../deferredActions/RemoveResourcesFromCard';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';

export class Ants extends Card implements IActionCard, IProjectCard, IResourceCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.ANTS,
      tags: [Tags.MICROBE],
      cost: 9,
      resourceType: ResourceType.MICROBE,

      requirements: CardRequirements.builder((b) => b.oxygen(4)),
      metadata: {
        cardNumber: '035',
        description: 'Requires 4% oxygen.',
        renderData: CardRenderer.builder((b) => {
          b.action('Remove 1 Microbe from any card to add 1 to this card.', (eb) => {
            eb.microbes(1).any.startAction.microbes(1);
          }).br;
          b.vpText('1 VP per 2 Microbes on this card.');
        }),
        victoryPoints: CardRenderDynamicVictoryPoints.microbes(1, 2),
      },
    });
  }

  public resourceCount = 0;

  public getVictoryPoints(): number {
    return Math.floor(this.resourceCount / 2);
  }

  public play() {
    return undefined;
  }

  public canAct(player: Player): boolean {
    if (player.game.isSoloMode()) return true;
    return RemoveResourcesFromCard.getAvailableTargetCards(player, this.resourceType).length > 0;
  }

  public action(player: Player) {
    player.game.defer(new RemoveResourcesFromCard(player, ResourceType.MICROBE));
    player.game.defer(new AddResourcesToCard(player, ResourceType.MICROBE, {filter: (c) => c.name === this.name}));
    return undefined;
  }
}
