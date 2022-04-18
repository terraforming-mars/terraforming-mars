import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../common/Resources';
import {Tags} from '../../common/cards/Tags';
import {CardRequirements} from '../CardRequirements';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {CardResource} from '../../common/CardResource';
import {ICard} from '../ICard';

export class SpaceDebrisCleaningOperation extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.SPACE_DEBRIS_CLEANING_OPERATION,
      cost: 7,
      tags: [Tags.MARS, Tags.SPACE],
      requirements: CardRequirements.builder((b) => b.tag(Tags.SPACE, 4)),

      metadata: {
        cardNumber: 'Pf24',
        renderData: CardRenderer.builder((b) => {
          b.titanium(3).br;
          b.wild(1).asterix().data().cards(1);
        }),
        // Nerfed by disallowing science resources (rather than the one The Moon does just to keep the text smaller.)
        description: 'Requires 4 space tags. Gain 3 titanium. ' +
          'Add 1 resource to any card (not cards that take ANIMAL or SCIENCE resources.) ' +
          'Add 1 data to any card. Draw 1 card.',
      },
    });
  }

  public play(player: Player) {
    player.addResource(Resources.TITANIUM, 3);
    player.game.defer(
      new AddResourcesToCard(
        player,
        undefined,
        {
          count: 1,
          filter: (card: ICard) => {
            return card.resourceType !== undefined && card.resourceType !== CardResource.SCIENCE && !card.tags.includes(Tags.ANIMAL);
          },
        },
      ));
    player.game.defer(new AddResourcesToCard(player, CardResource.DATA, {count: 1}));
    player.drawCard();
    return undefined;
  }
}

