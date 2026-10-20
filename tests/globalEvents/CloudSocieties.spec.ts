import {expect} from 'chai';
import {FloatingHabs} from '../../src/server/cards/venusNext/FloatingHabs';
import {CloudSocieties} from '../../src/server/turmoil/globalEvents/CloudSocieties';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {formatMessage, testGame} from '../TestingUtils';

describe('CloudSocieties', () => {
  it('resolve play', () => {
    const card = new CloudSocieties();
    const [game, player] = testGame(1, {turmoilExtension: true});
    const turmoil = game.turmoil!;
    const floatingHabs = new FloatingHabs();
    player.playedCards.push(floatingHabs);
    turmoil.chairman = player;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player;
    turmoil.dominantParty.delegates.add(player);
    card.resolve(game);
    game.deferredActions.runNext();

    expect(floatingHabs.resourceCount).to.eq(3);
  });

  it('logs the added floaters', () => {
    const card = new CloudSocieties();
    const [game, player] = testGame(1, {turmoilExtension: true});
    player.playedCards.push(new FloatingHabs());

    game.gameLog.length = 0;
    card.resolve(game);

    expect(game.gameLog.map(formatMessage).filter((message) => message.includes(' added '))).deep.eq([
      'blue added 1:cr:floater: to Floating Habs from Cloud Societies',
    ]);
  });
});
