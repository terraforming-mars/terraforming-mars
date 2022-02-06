import {expect} from 'chai';
import {LeadershipSummit} from '../../src/turmoil/globalEvents/LeadershipSummit';
import {Game} from '../../src/Game';
import {Turmoil} from '../../src/turmoil/Turmoil';
import {PartyName} from '../../src/common/turmoil/PartyName';
import {TestPlayers} from '../TestPlayers';

describe('LeadershipSummit', function() {
  it('resolve play', function() {
    const card = new LeadershipSummit();
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, player2], player);
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
