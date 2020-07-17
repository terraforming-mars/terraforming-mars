import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {SelectCard} from '../inputs/SelectCard';
import {SelectHowToPay} from '../inputs/SelectHowToPay';
import {IActionCard} from './ICard';
import {IProjectCard} from './IProjectCard';
import { Resources } from '../Resources';
import { CardName } from '../CardName';
import { LogHelper } from '../components/LogHelper';

export class BusinessNetwork implements IActionCard, IProjectCard {
    public cost: number = 4;
    public tags: Array<Tags> = [Tags.EARTH];
    public name: CardName = CardName.BUSINESS_NETWORK;
    public cardType: CardType = CardType.ACTIVE;
    public hasRequirements = false;
    public canPlay(player: Player): boolean {
      return player.getProduction(Resources.MEGACREDITS) >= -4;
    }
    public play(player: Player) {
      player.setProduction(Resources.MEGACREDITS,-1);
      return undefined;
    }
    public canAct(): boolean {
      return true;
    }
    public action(player: Player, game: Game) {
      const dealtCard = game.dealer.dealCard();
      const canSelectCard = player.canAfford(player.cardCost);

      return new SelectCard(
        canSelectCard ? "Select card to keep or none to discard" : "You cannot pay for this card" ,
        [dealtCard],
        (cards: Array<IProjectCard>) => {
          if (cards.length === 0 || !canSelectCard) {
            LogHelper.logCardChange(game, player, "discarded", 1);
            game.dealer.discard(dealtCard);
            return undefined;
          }
          if (player.canUseHeatAsMegaCredits && player.heat > 0) {
            return new SelectHowToPay(
              'Select how to pay and buy ' + dealtCard.name, false, false,
              true, player.cardCost,
              (htp) => {
                if (htp.heat + htp.megaCredits < player.cardCost) {
                  game.dealer.discard(dealtCard);
                  throw new Error('Not enough spent to buy card');
                }
                player.megaCredits -= htp.megaCredits;
                player.heat -= htp.heat;
                LogHelper.logCardChange(game, player, "drew", 1);
                player.cardsInHand.push(dealtCard);
                return undefined;
              }
            );
          }
          LogHelper.logCardChange(game, player, "drew", 1);
          player.cardsInHand.push(dealtCard);
          player.megaCredits -= player.cardCost;
          return undefined;
        }, canSelectCard ? 1 : 0 , 0
      );
    }
}
