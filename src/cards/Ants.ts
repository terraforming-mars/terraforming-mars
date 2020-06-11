import { IActionCard, ICard, IResourceCard } from './ICard';
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {SelectCard} from '../inputs/SelectCard';
import {ResourceType} from '../ResourceType';
import { CardName } from '../CardName';

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
      if (game.soloMode) return true;
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
      if (game.soloMode) {
        this.resourceCount++;
        return undefined;
      }

      const availableCards: Array<ICard> = this.getAvailableCards(game, player);
      return new SelectCard('Select card to remove microbe', availableCards,
          (foundCards: Array<ICard>) => {
            // TODO Log here
            game.getCardPlayer(foundCards[0].name).removeResourceFrom(foundCards[0], 1, game, player);    
            this.resourceCount++;
            return undefined;
          }
      );
    }
}
