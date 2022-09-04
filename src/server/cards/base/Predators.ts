import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {VictoryPoints} from '../ICard';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {RemoveResourcesFromCard} from '../../deferredActions/RemoveResourcesFromCard';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {all} from '../Options';

export class Predators extends Card implements IProjectCard, IActionCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.PREDATORS,
      tags: [Tag.ANIMAL],
      cost: 14,

      resourceType: CardResource.ANIMAL,
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

  public canAct(player: Player): boolean {
    if (player.game.isSoloMode()) return true;
    return RemoveResourcesFromCard.getAvailableTargetCards(player, CardResource.ANIMAL).length > 0;
  }

  public action(player: Player) {
    player.game.defer(new RemoveResourcesFromCard(player, CardResource.ANIMAL));
    player.game.defer(new AddResourcesToCard(player, CardResource.ANIMAL, {filter: (c) => c.name === this.name}));
    return undefined;
  }
}
