import {expect} from 'chai';
import {StripMine} from '../../src/server/cards/base/StripMine';
import {Game} from '../../src/server/Game';
import {Resources} from '../../src/common/Resources';
import {GlobalDustStorm} from '../../src/server/turmoil/globalEvents/GlobalDustStorm';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/server/turmoil/Turmoil';
import {TestPlayer} from '../TestPlayer';

describe('GlobalDustStorm', function() {
  it('resolve play', function() {
    const card = new GlobalDustStorm();
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, player2], player);
    const turmoil = Turmoil.newInstance(game);
    turmoil.initGlobalEvent(game);
    player.playedCards.push(new StripMine());
    player2.playedCards.push(new StripMine());
    player2.playedCards.push(new StripMine());
    turmoil.chairman = player2.id;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.push(player2.id);
    player.megaCredits = 10;
    player2.megaCredits = 10;
    player.heat = 7;
    card.resolve(game, turmoil);
    expect(player.getResource(Resources.MEGACREDITS)).to.eq(8);
    expect(player.getResource(Resources.HEAT)).to.eq(0);
    expect(player2.getResource(Resources.MEGACREDITS)).to.eq(10);
  });
});
