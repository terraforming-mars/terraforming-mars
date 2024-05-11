import {expect} from 'chai';
import {StripMine} from '../../src/server/cards/base/StripMine';
import {GlobalDustStorm} from '../../src/server/turmoil/globalEvents/GlobalDustStorm';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {testGame} from '../TestingUtils';

describe('GlobalDustStorm', function() {
  it('resolve play', function() {
    const card = new GlobalDustStorm();
    const [game, player, player2] = testGame(2, {turmoilExtension: true});
    const turmoil = game.turmoil!;
    player.playedCards.push(new StripMine());
    player2.playedCards.push(new StripMine());
    player2.playedCards.push(new StripMine());
    turmoil.chairman = player2;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2;
    turmoil.dominantParty.delegates.add(player2);
    player.megaCredits = 10;
    player2.megaCredits = 10;
    player.heat = 7;
    card.resolve(game, turmoil);
    expect(player.megaCredits).to.eq(8);
    expect(player.heat).to.eq(0);
    expect(player2.megaCredits).to.eq(10);
  });
});
