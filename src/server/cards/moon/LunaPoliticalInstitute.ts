import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {IActionCard} from '../ICard';
import {SendDelegateToArea} from '../../deferredActions/SendDelegateToArea';
import {Card} from '../Card';
import {Turmoil} from '../../turmoil/Turmoil';

export class LunaPoliticalInstitute extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      name: CardName.LUNA_POLITICAL_INSTITUTE,
      cardType: CardType.ACTIVE,
      tags: [Tag.MOON, Tag.EARTH],
      cost: 6,
      requirements: CardRequirements.builder((b) => b.tag(Tag.MOON, 2)),

      metadata: {
        description: 'Requires that you have 2 Moon tags.',
        cardNumber: 'M71',
        renderData: CardRenderer.builder((b) => {
          b.action(
            'Place one of your delegates in any party.',
            (eb) => eb.empty().startAction.delegates(1));
        }),
      },
    });
  }

  public canAct(player: Player) {
    return Turmoil.getTurmoil(player.game).hasDelegatesInReserve(player.id);
  }

  public action(player: Player) {
    player.game.defer(new SendDelegateToArea(player, 'Select where to send a delegate', {source: 'reserve'}));
    return undefined;
  }
}
