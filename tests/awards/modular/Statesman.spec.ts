import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {Politician} from '../../../src/server/awards/modular/Politician';
import {PartyName} from '../../../src/common/turmoil/PartyName';

describe('Politician', () => {
  let award: Politician;
  const [game, player, player2] = testGame(2, {turmoilExtension: true});

  it('Influence and party leader check', () => {
    // Have hope I didn's mess anything -_-
    award = new Politician();
    const turmoil = game.turmoil!;
    turmoil.chairman = 'NEUTRAL';
    game.turmoil!.sendDelegateToParty(player, PartyName.SCIENTISTS, game);

    expect(award.getScore(player)).to.eq(1); // 1 as player have 1 party leader and is this is dominant party (so 1 party leader)
    expect(award.getScore(player2)).to.eq(0); // 0 as player2 dont have any delegates in any parties

    game.turmoil!.sendDelegateToParty(player2, PartyName.SCIENTISTS, game);
    game.turmoil!.sendDelegateToParty(player2, PartyName.SCIENTISTS, game);

    expect(award.getScore(player)).to.eq(1); // 1 as player have delegate in dominant party (so 1 influence)
    expect(award.getScore(player2)).to.eq(3); // 3 as player2 is party leader and have delegate in dominant party (so 1 party leader + 2 influence)

    turmoil.chairman = player2;
    expect(award.getScore(player2)).to.eq(4); // 4 as player2 is party leader and have delegate in dominant party and is chairman (so 1 party leader and 3 influence)
  });
});
