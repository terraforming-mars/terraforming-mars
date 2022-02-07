import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../common/cards/CardName';
import {ResourceType} from '../../common/ResourceType';
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

