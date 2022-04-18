import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../common/cards/CardName';
import {CardResource} from '../../common/CardResource';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';

export class FloaterPrototypes extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 2,
      tags: [Tags.SCIENCE],
      name: CardName.FLOATER_PROTOTYPES,
      cardType: CardType.EVENT,


      metadata: {
        cardNumber: 'C11',
        renderData: CardRenderer.builder((b) => b.floaters(2).asterix()),
        description: 'Add two floaters to ANOTHER card.',
      },
    });
  }

  public play(player: Player) {
    player.game.defer(new AddResourcesToCard(player, CardResource.FLOATER, {count: 2}));
    return undefined;
  }
}

