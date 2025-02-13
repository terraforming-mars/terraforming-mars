import {expect} from 'chai';
import {FloatingHabs} from '../../src/server/cards/venusNext/FloatingHabs';
import {CloudSocieties} from '../../src/server/turmoil/globalEvents/CloudSocieties';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {testGame} from '../TestingUtils';

describe('CloudSocieties', () => {
  it('resolve play', () => {
    const card = new CloudSocieties();
    const [game, player] = testGame(1, {turmoilExtension: true});
    const turmoil = game.turmoil!;
    player.playedCards.push(new FloatingHabs());
    turmoil.chairman = player;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player;
    turmoil.dominantParty.delegates.add(player);
    card.resolve(game, turmoil);
    game.deferredActions.runNext();
    expect(player.playedCards[0].resourceCount).to.eq(3);
  });
});
