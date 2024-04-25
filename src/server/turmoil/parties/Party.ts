import {MultiSet} from 'mnemonist';
import {IGame} from '../../IGame';
import {IPlayer} from '../../IPlayer';
import {Delegate, NeutralPlayer} from '../Turmoil';
import {CardName} from '../../../common/cards/CardName';

export abstract class Party {
  public partyLeader: undefined | Delegate = undefined;
  public delegates = new MultiSet<Delegate>();

  // Send a delegate in the area
  public sendDelegate(delegate: Delegate, game: IGame): void {
    this.delegates.add(delegate);
    this.checkPartyLeader(delegate, game);
  }

  // Remove a delegate from the area
  public removeDelegate(delegate: Delegate, game: IGame): void {
    this.delegates.remove(delegate);
    this.checkPartyLeader(delegate, game);
  }

  private setPartyLeader(delegate: Delegate, game: IGame) {
    this.partyLeader = delegate;
    const cardPlayer = game.getCardPlayerOrUndefined(CardName.CORRIDORS_OF_POWER);
    if (cardPlayer === delegate) {
      cardPlayer.drawCard();
    }
  }

  // Check if you are the new party leader
  public checkPartyLeader(delegate: Delegate, game: IGame): void {
    const players = game.getPlayersInGenerationOrder();
    if (this.delegates.size === 0) {
      this.partyLeader = undefined;
      return;
    }
    if (this.partyLeader === undefined) {
      this.setPartyLeader(delegate, game);
      if (this.partyLeader === undefined) {
        // Satisfies Typescript
        throw new Error('Assertion error, party leader is defined');
      }
    }

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
          this.setPartyLeader(nextPlayer, game);
          return true;
        }
        return false;
      });
    }
  }
}
