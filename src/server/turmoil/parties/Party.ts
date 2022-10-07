import {Player} from '../../Player';
import {PlayerId} from '../../../common/Types';
import {Game} from '../../Game';
import {NeutralPlayer} from '../Turmoil';
import {MultiSet} from 'mnemonist';

export abstract class Party {
  public partyLeader: undefined | PlayerId | NeutralPlayer = undefined;
  public delegates = new MultiSet<PlayerId | NeutralPlayer>();

  // Send a delegate in the area
  public sendDelegate(playerId: PlayerId | NeutralPlayer, game: Game): void {
    this.delegates.add(playerId);
    this.checkPartyLeader(playerId, game);
  }

  // Remove a delegate from the area
  public removeDelegate(playerId: PlayerId | NeutralPlayer, game: Game): void {
    this.delegates.remove(playerId);
    this.checkPartyLeader(playerId, game);
  }

  // Check if you are the new party leader
  public checkPartyLeader(newPlayer: PlayerId | NeutralPlayer, game: Game): void {
    const players = game.getPlayersInGenerationOrder();
    // If there is a party leader
    if (this.partyLeader) {
      const max = this.delegates.top(1)[0][1];

      if (this.delegates.count(this.partyLeader) !== max) {
        let currentIndex = 0;
        if (this.partyLeader === 'NEUTRAL') {
          currentIndex = players.indexOf(game.getPlayerById(game.activePlayer));
        } else {
          currentIndex = players.indexOf(game.getPlayerById(this.partyLeader));
        }

        let playersToCheck: Array<Player | NeutralPlayer> = [];

        // Manage if it's the first player or the last
        if (players.length === 1 || currentIndex === 0) {
          playersToCheck = [...players];
        } else if (currentIndex === players.length - 1) {
          playersToCheck = players.slice(0, currentIndex);
          playersToCheck.unshift(players[currentIndex]);
        } else {
          const left = players.slice(0, currentIndex);
          const right = players.slice(currentIndex);
          playersToCheck = right.concat(left);
        }

        // Add NEUTRAL in the list
        playersToCheck.push('NEUTRAL');

        playersToCheck.some((nextPlayer) => {
          let nextPlayerId: PlayerId | NeutralPlayer;
          if (nextPlayer === 'NEUTRAL') {
            nextPlayerId = 'NEUTRAL';
          } else {
            nextPlayerId = nextPlayer.id;
          }
          if (this.delegates.get(nextPlayerId) === max) {
            this.partyLeader = nextPlayerId;
            return true;
          }
          return false;
        });
      }
    } else {
      this.partyLeader = newPlayer;
    }
  }
}
