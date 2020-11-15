import {expect} from 'chai';
import {StripMine} from '../../src/cards/base/StripMine';
import {Game} from '../../src/Game';
import {Election} from '../../src/turmoil/globalEvents/Election';
import {Kelvinists} from '../../src/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/turmoil/Turmoil';
import {TestPlayers} from '../TestingUtils';

describe('Election', function() {
  it('resolve play', function() {
    const card = new Election();
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const player3 = TestPlayers.GREEN.newPlayer();
    const game = new Game('foobar', [player, player2, player3], player);
    const turmoil = new Turmoil(game, false);
    turmoil.initGlobalEvent(game);
    player.playedCards.push(new StripMine());
    player2.playedCards.push(new StripMine());
    player2.playedCards.push(new StripMine());
    game.addCityTile(player3, game.board.getAvailableSpacesOnLand(player3)[0].id);
    turmoil.chairman = player2.id;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.push(player2.id);
    card.resolve(game, turmoil);
    expect(player.getTerraformRating()).to.eq(21);
    expect(player2.getTerraformRating()).to.eq(22);
    expect(player3.getTerraformRating()).to.eq(21);
  });
});
