import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {CardRequirements} from '../CardRequirements';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {CardResource} from '../../../common/CardResource';
import {ICard} from '../ICard';

export class SpaceDebrisCleaningOperation extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.SPACE_DEBRIS_CLEANING_OPERATION,
      cost: 7,
      tags: [Tag.MARS, Tag.SPACE],
      requirements: CardRequirements.builder((b) => b.tag(Tag.SPACE, 4)),

      behavior: {
        stock: {titanium: 3},
        addResourcesToAnyCard: {count: 1, type: CardResource.DATA},
        drawCard: 1,
      },

      metadata: {
        cardNumber: 'Pf24',
        renderData: CardRenderer.builder((b) => {
          b.titanium(3).br;
          b.wild(1).asterix().data().asterix().cards(1);
        }),
        // Nerfed by disallowing science resources (rather than the one The Moon does just to keep the text smaller.)
        description: 'Requires 4 space tags. Gain 3 titanium. ' +
          'Add 1 resource to ANY card (not cards that take ANIMAL or SCIENCE resources.) ' +
          'Add 1 data to ANY card. Draw 1 card.',
      },
    });
  }

  public override bespokePlay(player: Player) {
    player.game.defer(
      new AddResourcesToCard(
        player,
        undefined,
        {
          count: 1,
          filter: (card: ICard) => {
            return card.resourceType !== undefined && card.resourceType !== CardResource.SCIENCE && !card.tags.includes(Tag.ANIMAL);
          },
        },
      ));
    return undefined;
  }
}

