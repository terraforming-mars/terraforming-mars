import {CardName} from '@/common/cards/CardName';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {Tag} from '@/common/cards/Tag';
import {IProjectCard} from '@/server/cards/IProjectCard';
import {CardType} from '@/common/cards/CardType';
import {Card} from '@/server/cards/Card';
import {IActionCard} from '@/server/cards/ICard';
import {CardResource} from '@/common/CardResource';
import {IPlayer} from '@/server/IPlayer';
import {SelectPaymentDeferred} from '@/server/deferredActions/SelectPaymentDeferred';
import {SelectPlayer} from '@/server/inputs/SelectPlayer';
import {UnderworldExpansion} from '@/server/underworld/UnderworldExpansion';
import {TITLES} from '@/server/inputs/titles';
import {all} from '@/server/cards/Options';

export class InvestigativeJournalism extends Card implements IProjectCard, IActionCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.INVESTIGATIVE_JOURNALISM,
      cost: 3,
      tags: [Tag.EARTH],
      resourceType: CardResource.JOURNALISM,
      victoryPoints: {resourcesHere: {}},

      behavior: {
        production: {megacredits: -1},
      },

      metadata: {
        cardNumber: 'U087',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 5 M€ and remove 1 corruption from ANOTHER player with more corruption than you to add 1 journalism resource on this card.',
            (ab) => ab.megacredits(5).corruption(1, {all}).asterix().startAction.resource(CardResource.JOURNALISM)).br;
          b.production((pb) => pb.megacredits(-1));
        }),
        description: 'Decrease your M€ production 1 step. 1 VP per journalism resource on this card.',
      },
    });
  }

  public canAct(player: IPlayer) {
    return player.canAfford(5) && player.game.players.some((p) => p.underworldData.corruption > player.underworldData.corruption);
  }

  public action(player: IPlayer) {
    player.game.defer(new SelectPaymentDeferred(player, 5, {title: TITLES.payForCardAction(this.name)}))
      .andThen(() => {
        const moreCorruptPlayers = player.game.players.filter((p) => p.underworldData.corruption > player.underworldData.corruption);
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
