import {Player} from '../../Player';
import {PlayerId} from '../../common/Types';
import {Game} from '../../Game';
import {NeutralPlayer} from '../Turmoil';

export abstract class Party {
  public partyLeader: undefined | PlayerId | NeutralPlayer = undefined;
  public delegates: Array<PlayerId | NeutralPlayer> = [];

  // Send a delegate in the area
  public sendDelegate(playerId: PlayerId | NeutralPlayer, game: Game): void {
    this.delegates.push(playerId);
    this.checkPartyLeader(playerId, game);
  }

  // Remove a delegate from the area
  public removeDelegate(playerId: PlayerId | NeutralPlayer, game: Game): void {
    this.delegates.splice(this.delegates.indexOf(playerId), 1);
    this.checkPartyLeader(playerId, game);
  }

  // Check if you are the new party leader
  public checkPartyLeader(newPlayer: PlayerId | NeutralPlayer, game: Game): void {
    // If there is a party leader
    if (this.partyLeader) {
      if (game) {
        const sortedPlayers = [...this.getPresentPlayers()].sort(
          (p1, p2) => this.getDelegates(p2) - this.getDelegates(p1),
        );
        const max = this.getDelegates(sortedPlayers[0]);

        if (this.getDelegates(this.partyLeader) !== max) {
          let currentIndex = 0;
          if (this.partyLeader === 'NEUTRAL') {
            currentIndex = game.getPlayersInGenerationOrder().indexOf(game.getPlayerById(game.activePlayer));
          } else {
            currentIndex = game.getPlayersInGenerationOrder().indexOf(game.getPlayerById(this.partyLeader));
          }

          let playersToCheck: Array<Player | NeutralPlayer> = [];

          // Manage if it's the first player or the last
          if (game.getPlayersInGenerationOrder().length === 1 || currentIndex === 0) {
            playersToCheck = game.getPlayersInGenerationOrder();
          } else if (currentIndex === game.getPlayersInGenerationOrder().length - 1) {
            playersToCheck = game.getPlayersInGenerationOrder().slice(0, currentIndex);
            playersToCheck.unshift(game.getPlayersInGenerationOrder()[currentIndex]);
          } else {
            const left = game.getPlayersInGenerationOrder().slice(0, currentIndex);
            const right = game.getPlayersInGenerationOrder().slice(currentIndex);
            playersToCheck = right.concat(left);
          }

          // Add NEUTRAL in the list
          playersToCheck.push('NEUTRAL');

          playersToCheck.some((nextPlayer) => {
            let nextPlayerId = '';
            if (nextPlayer === 'NEUTRAL') {
              nextPlayerId = 'NEUTRAL';
            } else {
              nextPlayerId = nextPlayer.id;
            }
            if (this.getDelegates(nextPlayerId) === max) {
              this.partyLeader = nextPlayerId;
              return true;
            }
            return false;
          });
        }
      }
    } else {
      this.partyLeader = newPlayer;
    }
  }

  // List players present in this party
  public getPresentPlayers(): Array<PlayerId | NeutralPlayer> {
    return Array.from(new Set(this.delegates));
  }

  // Return number of delegate
  public getDelegates(player: PlayerId | NeutralPlayer): number {
    const delegates = this.delegates.filter((p) => p === player).length;
    return delegates;
  }
}
