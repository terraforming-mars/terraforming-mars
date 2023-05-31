import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {IProjectCard} from '../IProjectCard';
import {IActionCard} from '../ICard';
import {Player} from '../../Player';
import {IColonyTrader} from '../../colonies/IColonyTrader';
import {IColony} from '../../colonies/IColony';
import {ColoniesHandler} from '../../colonies/ColoniesHandler';
import {SelectColony} from '../../inputs/SelectColony';
import {newMessage} from '../../logs/MessageBuilder';

export class DarksideSmugglersUnion extends Card implements IProjectCard, IActionCard {
  constructor() {
    super({
      name: CardName.DARKSIDE_SMUGGLERS_UNION,
      type: CardType.ACTIVE,
      tags: [Tag.SPACE],
      cost: 17,

      behavior: {
        moon: {logisticsRate: 1},
      },

      metadata: {
        description: 'Raise the logistics rate 1 step.',
        cardNumber: 'M80',
        renderData: CardRenderer.builder((b) => {
          b.action('Perform a trade action.', (ab) => ab.empty().startAction.trade());
          b.br;
          b.moonLogisticsRate();
        }),
      },
    });
  }

  public canAct(player: Player): boolean {
    return player.colonies.canTrade() && ColoniesHandler.tradeableColonies(player.game).length > 0;
  }

  public action(player: Player) {
    const tradeableColonies = ColoniesHandler.tradeableColonies(player.game);
    return new SelectColony('Select colony tile to trade with for free', 'Select', tradeableColonies, (colony: IColony) => {
      colony.trade(player);
      return undefined;
    });
  }
}

export class TradeWithDarksideSmugglersUnion implements IColonyTrader {
  constructor(private player: Player) {}

  public canUse() {
    return this.player.playedCards.find((card) => card.name === CardName.DARKSIDE_SMUGGLERS_UNION) !== undefined &&
      !this.player.getActionsThisGeneration().has(CardName.DARKSIDE_SMUGGLERS_UNION);
  }

  public optionText() {
    return newMessage('Trade for free (use ${0} action)', (b) => b.cardName(CardName.DARKSIDE_SMUGGLERS_UNION));
  }

  public trade(colony: IColony) {
    this.player.addActionThisGeneration(CardName.DARKSIDE_SMUGGLERS_UNION);
    colony.trade(this.player);
  }
}
