import {expect} from 'chai';
import {FloatingHabs} from '../../src/cards/venusNext/FloatingHabs';
import {Game} from '../../src/Game';
import {CloudSocieties} from '../../src/turmoil/globalEvents/CloudSocieties';
import {Kelvinists} from '../../src/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/turmoil/Turmoil';
import * as utils from '../TestingUtils';

describe('CloudSocieties', function() {
  it('resolve play', function() {
    const card = new CloudSocieties();
    const player = utils.TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('foobar', [player], player);
    const turmoil = Turmoil.newInstance(game);
    player.playedCards.push(new FloatingHabs());
    turmoil.chairman = player.id;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player.id;
    turmoil.dominantParty.delegates.push(player.id);
    card.resolve(game, turmoil);
    utils.runNextAction(game);
    expect(player.playedCards[0].resourceCount).to.eq(3);
  });
});
