import {IProjectCard} from '../IProjectCard';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../common/cards/CardName';
import {DeferredAction} from '../../deferredActions/DeferredAction';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Size} from '../render/Size';

export class ProductiveOutpost extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 0,
      name: CardName.PRODUCTIVE_OUTPOST,
      cardType: CardType.AUTOMATED,

      metadata: {
        cardNumber: 'C30',
        renderData: CardRenderer.builder((b) => {
          b.text('Gain all your colony bonuses.', Size.SMALL, true);
        }),
      },
    });
  }

  public play(player: Player) {
    player.game.colonies.forEach((colony) => {
      colony.colonies.filter((owner) => owner === player.id).forEach((owner) => {
        // Not using GiveColonyBonus deferred action because it's only for the active player
        player.game.defer(new DeferredAction(player, () => colony.giveColonyBonus(player.game.getPlayerById(owner))));
      });
    });
    return undefined;
  }
}
