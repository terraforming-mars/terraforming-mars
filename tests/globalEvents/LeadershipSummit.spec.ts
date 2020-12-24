import {expect} from 'chai';
import {LeadershipSummit} from '../../src/turmoil/globalEvents/LeadershipSummit';
import {Player} from '../../src/Player';
import {Color} from '../../src/Color';
import {Game} from '../../src/Game';
import {Turmoil} from '../../src/turmoil/Turmoil';
import {PartyName} from '../../src/turmoil/parties/PartyName';

describe('LeadershipSummit', function() {
  it('resolve play', function() {
    const card = new LeadershipSummit();
    const player = new Player('test', Color.BLUE, false);
    const player2 = new Player('test2', Color.RED, false);
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
