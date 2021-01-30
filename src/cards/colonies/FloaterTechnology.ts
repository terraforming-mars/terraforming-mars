import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {ResourceType} from '../../ResourceType';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';

export class FloaterTechnology extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 7,
      tags: [Tags.SCIENCE],
      name: CardName.FLOATER_TECHNOLOGY,
      cardType: CardType.ACTIVE,

      metadata: {
        cardNumber: 'C12',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 floater to ANOTHER card.', (eb) => {
            eb.empty().startAction.floaters(1).asterix();
          });
        }),
      },
    });
  }

  public canAct(player: Player): boolean {
    return player.getResourceCards(ResourceType.FLOATER).length > 0;
  }

  public action(player: Player) {
    const floaterCards = player.getResourceCards(ResourceType.FLOATER);

    if (floaterCards.length) {
      player.game.defer(new AddResourcesToCard(player, ResourceType.FLOATER, {count: 1}));
    }

    return undefined;
  }

  public play() {
    return undefined;
  }
}

