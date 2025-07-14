import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardResource} from '../../../common/CardResource';
import {CardType} from '../../../common/cards/CardType';
import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {SelectCardDeferred} from '../../deferredActions/SelectCardDeferred';
import {CardRenderer} from '../render/CardRenderer';
import {IPlayer} from '../../IPlayer';
import {LogHelper} from '../../LogHelper';

export class BioengineeringEnclosure extends Card implements IProjectCard, IActionCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.BIOENGINEERING_ENCLOSURE,
      tags: [Tag.ANIMAL],
      cost: 7,
      resourceType: CardResource.ANIMAL,
      protectedResources: true,

      behavior: {
        addResources: 2,
      },

      requirements: {tag: Tag.SCIENCE},
      metadata: {
        description: 'Requires 1 science tag to play. Add 2 animals to this card. OTHERS MAY NOT REMOVE ANIMALS FROM THIS CARD.',
        cardNumber: 'A01',
        renderData: CardRenderer.builder((b) => {
          b.action('Remove 1 animal from THIS card to add 1 animal to ANOTHER card.', (eb) => {
            eb.resource(CardResource.ANIMAL).asterix().startAction.resource(CardResource.ANIMAL).asterix();
          }).br;
          b.resource(CardResource.ANIMAL, 2);
        }),
      },
    });
  }

  private availableCards(player: IPlayer) {
    return player.getResourceCards(this.resourceType).filter((card) => card.name !== this.name);
  }

  public canAct(player: IPlayer): boolean {
    return this.resourceCount > 0 && this.availableCards(player).length > 0;
  }

  public action(player: IPlayer) {
    player.game.defer(
      new SelectCardDeferred(
        player,
        this.availableCards(player),
        {
          title: 'Select card to add 1 animal',
          buttonLabel: 'Add animal',
        },
      ))
      .andThen((card) => {
        this.resourceCount--;
        player.addResourceTo(card, 1);
        LogHelper.logMoveResource(player, CardResource.ANIMAL, this, card);
      });
    return undefined;
  }
}
