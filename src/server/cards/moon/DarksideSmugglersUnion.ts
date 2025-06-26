import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {IProjectCard} from '../IProjectCard';
import {IActionCard} from '../ICard';
import {IPlayer} from '../../IPlayer';
import {IColonyTrader} from '../../colonies/IColonyTrader';
import {IColony} from '../../colonies/IColony';
import {ColoniesHandler} from '../../colonies/ColoniesHandler';
import {SelectColony} from '../../inputs/SelectColony';
import {message} from '../../logs/MessageBuilder';

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

  public canAct(player: IPlayer): boolean {
    return player.colonies.canTrade();
  }

  public action(player: IPlayer) {
    const tradeableColonies = ColoniesHandler.tradeableColonies(player.game);
    return new SelectColony('Select colony tile to trade with for free', 'Select', tradeableColonies)
      .andThen((colony: IColony) => {
        player.game.log('${0} traded with ${1}', (b) => b.player(player).colony(colony));
        colony.trade(player);
        return undefined;
      });
  }
}

export class TradeWithDarksideSmugglersUnion implements IColonyTrader {
  constructor(private player: IPlayer) {}

  public canUse() {
    return this.player.getPlayedCard(CardName.DARKSIDE_SMUGGLERS_UNION) !== undefined &&
      !this.player.actionsThisGeneration.has(CardName.DARKSIDE_SMUGGLERS_UNION);
  }

  public optionText() {
    return message('Trade for free (use ${0} action)', (b) => b.cardName(CardName.DARKSIDE_SMUGGLERS_UNION));
  }

  public trade(colony: IColony) {
    this.player.actionsThisGeneration.add(CardName.DARKSIDE_SMUGGLERS_UNION);
    this.player.game.log('${0} used ${1} action to trade with ${2}', (b) => b.player(this.player).cardName(CardName.DARKSIDE_SMUGGLERS_UNION).colony(colony));
    colony.trade(this.player);
  }
}
