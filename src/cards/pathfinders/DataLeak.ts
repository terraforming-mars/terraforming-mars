import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {ResourceType} from '../../ResourceType';

export class DataLeak extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.DATA_LEAK,
      cost: 5,

      metadata: {
        cardNumber: 'Pf30',
        renderData: CardRenderer.builder((b) => b.data({amount: 5})),
        description: 'Add 5 data to ANY card.',
      },
    });
  }

  public play(player: Player) {
    player.game.defer(new AddResourcesToCard(player, ResourceType.DATA, {count: 5}));
    return undefined;
  }
}
