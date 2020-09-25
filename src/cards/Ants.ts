import { IActionCard, ICard, IResourceCard } from "./ICard";
import {IProjectCard} from "./IProjectCard";
import {Tags} from "./Tags";
import {CardType} from "./CardType";
import {Player} from "../Player";
import {Game} from "../Game";
import {SelectCard} from "../inputs/SelectCard";
import {ResourceType} from "../ResourceType";
import { CardName } from "../CardName";
import { LogMessageType } from "../LogMessageType";
import { LogMessageData } from "../LogMessageData";
import { LogMessageDataType } from "../LogMessageDataType";

export class Ants implements IActionCard, IProjectCard, IResourceCard {
    public cost: number = 9;
    public tags: Array<Tags> = [Tags.MICROBES];
    public name: CardName = CardName.ANTS;
    public resourceType: ResourceType = ResourceType.MICROBE;
    public resourceCount: number = 0;
    public cardType: CardType = CardType.ACTIVE;
    public canPlay(player: Player, game: Game): boolean {
      return game.getOxygenLevel() >= 4 - player.getRequirementsBonus(game);
    }
    public getVictoryPoints(): number {
      return Math.floor(this.resourceCount / 2);
    }
    public play() {
      return undefined;
    }
    public canAct(player: Player, game: Game): boolean {
      if (game.isSoloMode()) return true;
      return this.getAvailableCards(game, player).length > 0;
    }
    private getAvailableCards(game: Game, currentPlayer: Player): Array<ICard> {
      const availableCards: Array<ICard> = [];
      for (const gamePlayer of game.getPlayers()) {
        // Microbes of this player are protected
        if (gamePlayer.hasProtectedHabitats() && gamePlayer.id !== currentPlayer.id) continue;
        availableCards.push(...gamePlayer.getCardsWithResources().filter(card => card.resourceType === ResourceType.MICROBE 
          && card.name !== this.name));
      }
      return availableCards;
    }
    public action(player: Player, game: Game) {
      // Solo play, can always steal from immaginary opponent
      if (game.isSoloMode()) {
        player.addResourceTo(this);
        return undefined;
      }

      const availableCards: Array<ICard> = this.getAvailableCards(game, player);

      // Auto select if there is only one possible target
      if (availableCards.length === 1) {
        game.getCardPlayer(availableCards[0].name).removeResourceFrom(availableCards[0], 1, game, player, false);    
        player.addResourceTo(this);
        this.logCardAction(game, player, availableCards[0]);
        return undefined;
      }

      return new SelectCard("Select card to remove microbe", "Remove microbe", availableCards,
          (foundCards: Array<ICard>) => {
            game.getCardPlayer(foundCards[0].name).removeResourceFrom(foundCards[0], 1, game, player, false);
            player.addResourceTo(this);
            this.logCardAction(game, player, foundCards[0]);
            return undefined;
          }
      );
    }

    private logCardAction(game: Game, player: Player, card?: ICard) {
      const target = card ? new LogMessageData(LogMessageDataType.CARD, card.name) : new LogMessageData(LogMessageDataType.STRING, "Neutral Player");

      game.log(
        LogMessageType.DEFAULT,
        "${0} removed a microbe from ${1}",
        new LogMessageData(LogMessageDataType.PLAYER, player.id),
        target
      );
    }
}
