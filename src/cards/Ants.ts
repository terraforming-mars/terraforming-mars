import {IActionCard} from './ICard';
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {SelectCard} from '../inputs/SelectCard';
import {ResourceType} from '../ResourceType';

export class Ants implements IActionCard, IProjectCard {
    public cost: number = 9;
    public nonNegativeVPIcon: boolean = true;
    public tags: Array<Tags> = [Tags.MICROBES];
    public name: string = 'Ants';
    public resourceType: ResourceType = ResourceType.MICROBE;
    public cardType: CardType = CardType.ACTIVE;
    public canPlay(player: Player, game: Game): boolean {
      return game.getOxygenLevel() >= 4 - player.getRequirementsBonus(game);
    }
    public onGameEnd(player: Player) {
      player.victoryPoints += Math.floor(player.getResourcesOnCard(this) / 2);
    }
    public play() {
      return undefined;
    }
    public canAct(_player: Player, game: Game): boolean {
      return this.getAvailableCards(game, _player).length > 0;
    }
    private getAvailableCards(game: Game, currentPlayer: Player): Array<IProjectCard> {
      const availableCards: Array<IProjectCard> = [];
      for (const gamePlayer of game.getPlayers()) {
        // Microbes of this player are protected
        if (gamePlayer.hasProtectedHabitats() && gamePlayer.id !== currentPlayer.id) continue;

        for (const playedCard of gamePlayer.playedCards) {
          // Do not remove Microbes from this card itself
          if (this.name === playedCard.name) continue;
          // No resources, sorry
          if (gamePlayer.getResourcesOnCard(playedCard) < 1) continue;
          // Resources are not the Microbes
          if (playedCard.resourceType !== ResourceType.MICROBE) continue;

          availableCards.push(playedCard);
        }
      }
      return availableCards;
    }
    public action(player: Player, game: Game) {
      const availableCards: Array<IProjectCard> = this.getAvailableCards(game, player);
      return new SelectCard('Select card to remove microbe', availableCards,
          (foundCards: Array<IProjectCard>) => {
            // TODO Log here
            game.getCardPlayer(foundCards[0].name).
                removeMicrobes(player, foundCards[0], 1);
            player.addResourceTo(this);
            return undefined;
          }
      );
    }
}
