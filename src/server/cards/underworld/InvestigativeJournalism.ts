import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {IProjectCard} from '../IProjectCard';
import {CardType} from '../../../common/cards/CardType';
import {Card} from '../Card';
import {IActionCard} from '../ICard';
import {CardResource} from '../../../common/CardResource';
import {IPlayer} from '../../IPlayer';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';
import {SelectPlayer} from '../../inputs/SelectPlayer';
import {UnderworldExpansion} from '../../underworld/UnderworldExpansion';
import {TITLES} from '../../inputs/titles';

export class InvestigativeJournalism extends Card implements IProjectCard, IActionCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.INVESTIGATIVE_JOURNALISM,
      cost: 3,
      tags: [Tag.EARTH],
      resourceType: CardResource.JOURNALISM,
      victoryPoints: {resourcesHere: {}, per: 2},

      behavior: {
        production: {megacredits: -2},
      },

      metadata: {
        cardNumber: 'U87',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 5 M€ and remove 1 corruption from ANOTHER player with more corruption than you to add 1 journalism resource on this card.',
            (ab) => ab.megacredits(5).corruption(1).asterix().startAction.journalism(1)).br;
          b.production((pb) => pb.megacredits(-2));
        }),
        description: 'Decrease your M€ production 2 steps. 1 VP per 2 journalism resources on this card.',
      },
    });
  }

  public canAct(player: IPlayer) {
    return player.canAfford(5) && player.game.getPlayers().some((p) => p.underworldData.corruption > player.underworldData.corruption);
  }

  public action(player: IPlayer) {
    player.game.defer(new SelectPaymentDeferred(player, 5, {title: TITLES.payForCardAction(this.name)}))
      .andThen(() => {
        const moreCorruptPlayers = player.game.getPlayers().filter((p) => p.underworldData.corruption > player.underworldData.corruption);
        player.defer(new SelectPlayer(moreCorruptPlayers, 'Select player to lose 1 corruption', 'Select player')
          .andThen((target) => {
            UnderworldExpansion.loseCorruption(target, 1, {log: true});
            player.addResourceTo(this, 1);
            return undefined;
          }));
      });
    return undefined;
  }
}
