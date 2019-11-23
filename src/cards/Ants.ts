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
    public actionText: string = 'Remove 1 microbe from any card to add' +
      ' 1 to this card.';
    public text: string = 'Requires 4% oxygen. Gain 1 victory point' +
      ' per 2 microbes on this card.';
    public requirements: string = '4% Oxygen';
    public description: string = 'Although an important part of many ' +
      'ecosystems, ants can also be detrimental to other organisms.';
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
      return this.getAvailableCards(game).length > 0;
    }
    private getAvailableCards(game: Game): Array<IProjectCard> {
      const availableCards: Array<IProjectCard> = [];
      game.getPlayers().forEach((gamePlayer) => {
        gamePlayer.playedCards.forEach((playedCard) => {
          if (gamePlayer.getResourcesOnCard(playedCard) > 0) {
            availableCards.push(playedCard);
          }
        });
      });
      return availableCards;
    }
    public action(player: Player, game: Game) {
      const availableCards: Array<IProjectCard> = this.getAvailableCards(game);
      return new SelectCard('Select card to remove microbe', availableCards,
          (foundCards: Array<IProjectCard>) => {
            game.getCardPlayer(foundCards[0].name).
                removeMicrobes(player, foundCards[0], 1);
            player.addResourceTo(this);
            return undefined;
          }
      );
    }
}
