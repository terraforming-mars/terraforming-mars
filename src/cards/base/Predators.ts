import {IActionCard, IResourceCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {VictoryPoints} from '../ICard';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {ResourceType} from '../../ResourceType';
import {CardName} from '../../CardName';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {RemoveResourcesFromCard} from '../../deferredActions/RemoveResourcesFromCard';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {all} from '../Options';

export class Predators extends Card implements IProjectCard, IActionCard, IResourceCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.PREDATORS,
      tags: [Tags.ANIMAL],
      cost: 14,

      resourceType: ResourceType.ANIMAL,
      victoryPoints: VictoryPoints.resource(1, 1),
      requirements: CardRequirements.builder((b) => b.oxygen(11)),

      metadata: {
        cardNumber: '024',
        renderData: CardRenderer.builder((b) => {
          b.action('Remove 1 Animal from any card and add it to this card.', (eb) => {
            eb.animals(1, {all}).startAction.animals(1);
          }).br;
          b.vpText('1 VP per Animal on this card.');
        }),
        description: 'Requires 11% oxygen.',
      },
    });
  }

    public resourceCount: number = 0;

    public play() {
      return undefined;
    }

    public canAct(player: Player): boolean {
      if (player.game.isSoloMode()) return true;
      return RemoveResourcesFromCard.getAvailableTargetCards(player, ResourceType.ANIMAL).length > 0;
    }

    public action(player: Player) {
      player.game.defer(new RemoveResourcesFromCard(player, ResourceType.ANIMAL));
      player.game.defer(new AddResourcesToCard(player, ResourceType.ANIMAL, {filter: (c) => c.name === this.name}));
      return undefined;
    }
}
