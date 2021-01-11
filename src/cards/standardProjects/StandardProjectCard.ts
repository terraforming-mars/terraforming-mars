import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {ICard} from '../ICard';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectAmount} from '../../inputs/SelectAmount';
import {SelectHowToPay} from '../../inputs/SelectHowToPay';
import {SelectOption} from '../../inputs/SelectOption';
import {IProjectCard} from '../IProjectCard';
import {SelectPlayer} from '../../inputs/SelectPlayer';
import {AndOptions} from '../../inputs/AndOptions';
import {SelectCard} from '../../inputs/SelectCard';
import {SelectSpace} from '../../inputs/SelectSpace';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';
import {StandardActionCard} from '../standardActions/StandardActionCard';

export abstract class StandardProjectCard extends StandardActionCard {
    public cardType = CardType.STANDARD_PROJECT;
    protected discount(_player: Player) {
      return 0;
    }

    protected abstract actionEssence(player: Player, game: Game): void

    public onStandardProject(player: Player): void {
      if (player.corporationCard?.onStandardProject !== undefined) {
        player.corporationCard.onStandardProject(player, this);
      }

      for (const playedCard of player.playedCards) {
        if (playedCard.onStandardProject !== undefined) {
          playedCard.onStandardProject(player, this);
        }
      }
    }

    public canAct(player: Player, game: Game): boolean {
      return player.canAfford(this.cost - this.discount(player), game);
    }

    protected projectPlayed(player: Player, game: Game) {
      game.log('${0} used ${1} standard project', (b) => b.player(player).card(this));
      this.onStandardProject(player);
    }

    public action(player: Player, game: Game): OrOptions | SelectOption | AndOptions | SelectAmount | SelectCard<ICard> | SelectCard<IProjectCard> | SelectHowToPay | SelectPlayer | SelectSpace | undefined {
      game.defer(new SelectHowToPayDeferred(
        player,
        this.cost - this.discount(player),
        {
          title: `Select how to pay for ${this.name} project`,
          afterPay: () => {
            this.actionEssence(player, game);
          },
        }));
      this.projectPlayed(player, game);
      return undefined;
    }
}
