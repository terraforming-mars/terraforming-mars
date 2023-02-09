import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardResource} from '../../../common/CardResource';
import {CardType} from '../../../common/cards/CardType';
import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {SelectCard} from '../../inputs/SelectCard';
import {SimpleDeferredAction} from '../../deferredActions/DeferredAction';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Player} from '../../Player';

export class BioengineeringEnclosure extends Card implements IProjectCard, IActionCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.BIOENGINEERING_ENCLOSURE,
      tags: [Tag.ANIMAL],
      cost: 7,
      resourceType: CardResource.ANIMAL,

      behavior: {
        addResources: 2,
      },

      requirements: CardRequirements.builder((b) => b.tag(Tag.SCIENCE)),
      metadata: {
        description: 'Requires 1 science tag to play. Add 2 animals to this card. OTHERS MAY NOT REMOVE ANIMALS FROM THIS CARD.',
        cardNumber: 'A01',
        renderData: CardRenderer.builder((b) => {
          b.action('Remove 1 animal from THIS card to add 1 animal to ANOTHER card.', (eb) => {
            eb.animals(1).asterix().startAction.animals(1).asterix();
          }).br;
          b.animals(2);
        }),
      },
    });
  }

  public canAct(player: Player): boolean {
    // >1 because this player already has bioengineering enclosure.
    return this.resourceCount > 0 && player.getResourceCards(this.resourceType).length > 1;
  }

  public action(player: Player) {
    player.game.defer(new SimpleDeferredAction(
      player,
      () => {
        const resourceCards = player.getResourceCards(this.resourceType).filter((card) => card.name !== CardName.BIOENGINEERING_ENCLOSURE);

        if (resourceCards.length === 0) {
          return undefined;
        }

        if (resourceCards.length === 1) {
          this.resourceCount--;
          player.addResourceTo(resourceCards[0], 1);
          player.game.log('${0} moved 1 animal from Bioengineering Enclosure to ${1}.', (b) => b.player(player).card(resourceCards[0]));
          return undefined;
        }

        return new SelectCard(
          'Select card to add 1 animal',
          'Add animal',
          resourceCards,
          ([card]) => {
            this.resourceCount--;
            player.addResourceTo(card, 1);
            player.game.log('${0} moved 1 animal from Bioengineering Enclosure to ${1}.', (b) => b.player(player).card(card));
            return undefined;
          },
        );
      },
    ));
    return undefined;
  }
}
