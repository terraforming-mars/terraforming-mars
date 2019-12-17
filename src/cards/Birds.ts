
import {IActionCard} from './ICard';
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {ResourceType} from '../ResourceType';
import {SelectPlayer} from '../inputs/SelectPlayer';

export class Birds implements IActionCard, IProjectCard {
    public cost: number = 10;
    public nonNegativeVPIcon: boolean = true;
    public tags: Array<Tags> = [Tags.ANIMAL];
    public name: string = 'Birds';
    public resourceType: ResourceType = ResourceType.ANIMAL;
    public cardType: CardType = CardType.ACTIVE;

    private playersWithPlantProduction(game: Game): boolean {
      // We must reduce someone plant production 2 times
      // so target must be available
      for (const player of game.getPlayers()) {
        if (player.plantProduction >= 2) return true;
      }
      return false;
    }

    public canPlay(player: Player, game: Game): boolean {
      if (game.getPlayers().length > 1 && ! this.playersWithPlantProduction(game)) {
        return false;
      }
      return game.getOxygenLevel() >= 13 - player.getRequirementsBonus(game);
    }
    public onGameEnd(player: Player) {
      player.victoryPoints += player.getResourcesOnCard(this);
    }
    public play(_player: Player, game: Game) {
      if (game.getPlayers().length == 1) return undefined;
      if ( ! this.canPlay(_player, game)) {
        throw new Error("Card requirements are not satisfied")
      }
      return new SelectPlayer(
          game.getPlayers(),
          'Select player to decrease plant production 2 steps',
          (foundPlayer: Player) => {
            if (foundPlayer.plantProduction < 2) {
              throw new Error('Player needs at least 2 plant production');
            }
            foundPlayer.plantProduction -= 2;
            return undefined;
          }
      );
    }
    public canAct(): boolean {
      return true;
    }
    public action(player: Player) {
      player.addResourceTo(this);
      return undefined;
    }
}
