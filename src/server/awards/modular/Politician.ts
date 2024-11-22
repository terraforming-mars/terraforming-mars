import {IPlayer} from '../../IPlayer';
import {IAward} from '../IAward';
import {Turmoil} from '../../turmoil/Turmoil';

export class Politician implements IAward {
  public readonly name = 'Politician';
  public readonly description = 'Have the most party leaders and influence combined.';

  public getScore(player: IPlayer): number {
    Turmoil;
    const turmoil = Turmoil.getTurmoil(player.game);
    const partyLeaderCount = turmoil.parties.filter((party) => party.partyLeader === player).length;
    return partyLeaderCount + turmoil.getPlayerInfluence(player);
  }
}
