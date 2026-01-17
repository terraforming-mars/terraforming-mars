import {Tag} from '@/common/cards/Tag';
import {IPlayer} from '@/server/IPlayer';
import {PreludeCard} from '@/server/cards/prelude/PreludeCard';
import {CardName} from '@/common/cards/CardName';
import {SelectPaymentDeferred} from '@/server/deferredActions/SelectPaymentDeferred';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {PathfindersExpansion} from '@/server/pathfinders/PathfindersExpansion';

export class BusinessEmpire extends PreludeCard {
  constructor() {
    super({
      name: CardName.BUSINESS_EMPIRE,
      tags: [Tag.EARTH],

      behavior: {
        production: {megacredits: 6},
      },
      startingMegacredits: -6,

      metadata: {
        cardNumber: 'P06',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(6)).br;
          b.megacredits(-6);
        }),
        description: 'Increase your M€ production 6 steps. Pay 6 M€.',
      },
    });
  }
  public override bespokeCanPlay(player: IPlayer) {
    if (player.tableau.has(CardName.MANUTECH)) return true;
    return player.canAfford(6);
  }
  public override bespokePlay(player: IPlayer) {
    player.game.defer(new SelectPaymentDeferred(player, -this.startingMegaCredits)).andThen(() => {
      PathfindersExpansion.addToSolBank(player);
    });
    return undefined;
  }
}

