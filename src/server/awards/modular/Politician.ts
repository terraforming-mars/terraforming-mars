import {IPlayer} from '@/server/IPlayer';
import {IAward} from '@/server/awards/IAward';
import {Turmoil} from '@/server/turmoil/Turmoil';

export class Politician implements IAward {
  public readonly name = 'Politician';
  public readonly description = 'Have the most party leaders and influence combined.';

  public getScore(player: IPlayer): number {
    Turmoil;
    const turmoil = Turmoil.getTurmoil(player.game);
    const partyLeaderCount = turmoil.parties.filter((party) => party.partyLeader === player).length;
    return partyLeaderCount + turmoil.getInfluence(player);
  }
}
