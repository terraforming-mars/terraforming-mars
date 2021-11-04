import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {IActionCard, ICard} from '../ICard';
import {Tags} from '../Tags';
import {CardRequirements} from '../CardRequirements';
import {ResourceType} from '../../ResourceType';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {digit} from '../Options';

export class NobelLabs extends Card implements IProjectCard, IActionCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.NOBEL_LABS,
      cost: 9,
      tags: [Tags.PLANT, Tags.ANIMAL, Tags.MARS],
      requirements: CardRequirements.builder((b) => b.tag(Tags.SCIENCE, 4)),

      metadata: {
        cardNumber: 'Pf55',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 2 microbes OR 2 data OR 2 floaters to ANY card.', (eb) => {
            eb.empty().startAction.microbes(2, {digit}).slash().data({amount: 2, digit}).slash().floaters(2, {digit});
          });
        }),
        description: 'Requires 4 Science tags.',
      },
    });
  }

  private static RESOURCE_TYPES: Array<ResourceType> = [ResourceType.MICROBE, ResourceType.DATA, ResourceType.FLOATER];
  private static PREDICATE = (card: ICard) => card.resourceType !== undefined && NobelLabs.RESOURCE_TYPES.includes(card.resourceType);

  public canAct(player: Player) {
    return player.getResourceCards().some(NobelLabs.PREDICATE);
  }

  public action(player: Player) {
    player.game.defer(new AddResourcesToCard(player, undefined, {filter: NobelLabs.PREDICATE, count: 2}));
    return undefined;
  }

  public play() {
    return undefined;
  }
}

