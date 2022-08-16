import {expect} from 'chai';
import {LeadershipSummit} from '../../src/server/turmoil/globalEvents/LeadershipSummit';
import {Game} from '../../src/server/Game';
import {Turmoil} from '../../src/server/turmoil/Turmoil';
import {PartyName} from '../../src/common/turmoil/PartyName';
import {TestPlayer} from '../TestPlayer';

describe('LeadershipSummit', function() {
  it('resolve play', function() {
    const card = new LeadershipSummit();
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, player2], player);
    const turmoil = Turmoil.newInstance(game);

    turmoil.dominantParty = turmoil.getPartyByName(PartyName.REDS)!;
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.push(player2.id);
    turmoil.dominantParty.delegates.push(player2.id);
    turmoil.dominantParty.delegates.push(player.id);

    card.resolve(game, turmoil);
    expect(player.cardsInHand).has.lengthOf(1);
    expect(player2.cardsInHand).has.lengthOf(3);
  });
});
