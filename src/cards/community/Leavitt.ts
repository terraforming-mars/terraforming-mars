import {Colony, IColony} from '../../colonies/Colony';
import {Player} from '../../Player';
import {PlayerInput} from '../../PlayerInput';
import {Game} from '../../Game';
import {ColonyName} from '../../colonies/ColonyName';
import {IProjectCard} from '../IProjectCard';
import {SelectCard} from '../../inputs/SelectCard';
import {SelectCardToKeep} from '../../deferredActions/SelectCardToKeep';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';
import {ScienceTagCard} from './ScienceTagCard';

export class Leavitt extends Colony implements IColony {
    public name = ColonyName.LEAVITT;
    public description: string = 'Science';

    public trade(player: Player, game: Game, usesTradeFleet: boolean = true): void {
      if (usesTradeFleet) this.beforeTrade(this, player, game);

      const qty = this.trackPosition + 1;
      const cardsDrawn: Array<IProjectCard> = [];

      for (let counter = 0; counter < qty; counter++) {
        cardsDrawn.push(game.dealer.dealCard());
      };

      game.defer(new SelectCardToKeep(player, game, 'Select card to take into hand', cardsDrawn));

      if (usesTradeFleet) this.afterTrade(this, player, game);
    }

    public onColonyPlaced(player: Player, game: Game): undefined {
      super.addColony(this, player, game);
      player.scienceTagCount += 1;
      player.playCard(game, new ScienceTagCard());

      return undefined;
    }

    public giveTradeBonus(player: Player, game: Game): undefined | PlayerInput {
      const dealtCard = game.dealer.dealCard();
      const canSelectCard = player.canAfford(player.cardCost);

      return new SelectCard(
            canSelectCard ? 'Select card to buy or none to discard' : 'You cannot pay for this card',
            'Save',
            [dealtCard],
            (cards: Array<IProjectCard>) => {
              if (cards.length === 0 || !canSelectCard) {
                this.logColonyBonusCard(player, game, 'discarded', dealtCard);
                game.dealer.discard(dealtCard);
                return undefined;
              }

              this.logColonyBonusCard(player, game, 'bought', dealtCard);
              player.cardsInHand.push(dealtCard);
              game.defer(new SelectHowToPayDeferred(player, player.cardCost, false, false, 'Select how to pay for action'));
              return undefined;
            },
            canSelectCard ? 1 : 0,
            0,
      );
    }

    private logColonyBonusCard(player: Player, game: Game, action: string, card: IProjectCard) {
      game.log(
          '${0} ${1} ${2}',
          (b) => b.player(player).string(action).card(card),
      );
    }
}
