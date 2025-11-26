import {IActionCard} from '@/server/cards/ICard';
import {IProjectCard} from '@/server/cards/IProjectCard';
import {Tag} from '@/common/cards/Tag';
import {Card} from '@/server/cards/Card';
import {CardType} from '@/common/cards/CardType';
import {IPlayer} from '@/server/IPlayer';
import {CardResource} from '@/common/CardResource';
import {CardName} from '@/common/cards/CardName';
import {AddResourcesToCard} from '@/server/deferredActions/AddResourcesToCard';
import {RemoveResourcesFromCard} from '@/server/deferredActions/RemoveResourcesFromCard';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {all} from '@/server/cards/Options';

export class Predators extends Card implements IProjectCard, IActionCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.PREDATORS,
      tags: [Tag.ANIMAL],
      cost: 14,

      resourceType: CardResource.ANIMAL,
      victoryPoints: {resourcesHere: {}},
      requirements: {oxygen: 11},

      metadata: {
        cardNumber: '024',
        renderData: CardRenderer.builder((b) => {
          b.action('Remove 1 animal from any card and add it to this card.', (eb) => {
            eb.resource(CardResource.ANIMAL, {all}).startAction.resource(CardResource.ANIMAL);
          }).br;
          b.vpText('1 VP per animal on this card.');
        }),
        description: 'Requires 11% oxygen.',
      },
    });
  }

  public canAct(player: IPlayer): boolean {
    if (player.game.isSoloMode()) return true;
    return RemoveResourcesFromCard.getAvailableTargetCards(player, CardResource.ANIMAL).length > 0;
  }

  public action(player: IPlayer) {
    player.game.defer(
      new RemoveResourcesFromCard(player, CardResource.ANIMAL, 1, {log: true})
        .andThen((response) => {
          if (response.proceed) {
            player.game.defer(new AddResourcesToCard(player, CardResource.ANIMAL, {filter: (c) => c.name === this.name}));
          }
        }));
    return undefined;
  }
}
