import {IGame} from '../../IGame';
import {IPlayer} from '../../IPlayer';
import {Delegate, NeutralPlayer} from '../Turmoil';
import {MultiSet} from 'mnemonist';

export abstract class Party {
  public partyLeader: undefined | Delegate = undefined;
  public delegates = new MultiSet<Delegate>();

  // Send a delegate in the area
  public sendDelegate(playerId: Delegate, game: IGame): void {
    this.delegates.add(playerId);
    this.checkPartyLeader(playerId, game);
  }

  // Remove a delegate from the area
  public removeDelegate(playerId: Delegate, game: IGame): void {
    this.delegates.remove(playerId);
    this.checkPartyLeader(playerId, game);
  }

  // Check if you are the new party leader
  public checkPartyLeader(newPlayer: Delegate, game: IGame): void {
    const players = game.getPlayersInGenerationOrder();
    // If there is a party leader
    if (this.partyLeader) {
      const max = this.delegates.top(1)[0][1];

      if (this.delegates.count(this.partyLeader) !== max) {
        let currentIndex = 0;
        if (this.partyLeader === 'NEUTRAL') {
          currentIndex = players.indexOf(game.getPlayerById(game.activePlayer));
        } else {
          currentIndex = players.indexOf(this.partyLeader);
        }

        let playersToCheck: Array<IPlayer | NeutralPlayer> = [];

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
          if (this.delegates.get(nextPlayer) === max) {
            this.partyLeader = nextPlayer;
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
