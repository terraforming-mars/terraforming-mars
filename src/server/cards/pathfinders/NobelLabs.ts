import {IProjectCard} from '@/server/cards/IProjectCard';
import {IPlayer} from '@/server/IPlayer';
import {Card} from '@/server/cards/Card';
import {CardType} from '@/common/cards/CardType';
import {CardName} from '@/common/cards/CardName';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {IActionCard, ICard} from '@/server/cards/ICard';
import {Tag} from '@/common/cards/Tag';
import {CardResource} from '@/common/CardResource';
import {AddResourcesToCard} from '@/server/deferredActions/AddResourcesToCard';
import {digit} from '@/server/cards/Options';

export class NobelLabs extends Card implements IProjectCard, IActionCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.NOBEL_LABS,
      cost: 8,
      tags: [Tag.SCIENCE],
      requirements: {tag: Tag.SCIENCE, count: 4},

      metadata: {
        cardNumber: 'Pf60',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 2 microbes OR 2 data OR 2 floaters to ANY card.', (eb) => {
            eb.empty().startAction.resource(CardResource.MICROBE, {amount: 2, digit}).slash().resource(CardResource.DATA, {amount: 2, digit}).slash().resource(CardResource.FLOATER, {amount: 2, digit}).asterix();
          });
        }),
        description: 'Requires 4 science tags.',
      },
    });
  }

  private static RESOURCE_TYPES: Array<CardResource> = [CardResource.MICROBE, CardResource.DATA, CardResource.FLOATER, CardResource.WARE];
  private static PREDICATE = (card: ICard) => card.resourceType !== undefined && NobelLabs.RESOURCE_TYPES.includes(card.resourceType);

  public canAct(player: IPlayer) {
    return player.getResourceCards().some(NobelLabs.PREDICATE);
  }

  public action(player: IPlayer) {
    player.game.defer(new AddResourcesToCard(player, undefined, {filter: NobelLabs.PREDICATE, count: 2}));
    return undefined;
  }
}

