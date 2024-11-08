import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';
import {Turmoil} from '../../turmoil/Turmoil';
import {IParty} from '../../turmoil/parties/IParty';

export class Lobbyist extends BaseMilestone {
  constructor() {
    super(
      'Lobbyist',
      'Having all 7 delegates in parties (Party Leaders and Chairman also count)',
      7);
  }
  public getScore(player: IPlayer): number {
    const game = player.game;
    const turmoil = Turmoil.getTurmoil(game);
    let delegateCount = 0;

    turmoil.parties.forEach((party: IParty) => {
      if (party.delegates.has(player)) {
        delegateCount += party.delegates.get(player);
      }
    });

    if (turmoil.chairman === player) {
      delegateCount++;
    }

    return delegateCount;
  }
}
