import {expect} from 'chai';
import {Sponsors} from '../../src/cards/base/Sponsors';
import {Game} from '../../src/Game';
import {Player} from '../../src/Player';
import {Revolution} from '../../src/turmoil/globalEvents/Revolution';
import {Kelvinists} from '../../src/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/turmoil/Turmoil';
import {TestPlayers} from '../TestPlayers';

describe('Revolution', function() {
  let card : Revolution; let player : Player; let player2 : Player; let game : Game; let turmoil: Turmoil;

  beforeEach(function() {
    card = new Revolution();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();

    game = Game.newInstance('foobar', [player, player2], player);
    turmoil = Turmoil.newInstance(game);

    turmoil.initGlobalEvent(game);
    turmoil.chairman = player2.id;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.push(player2.id);
  });

  it('resolve play', function() {
    player.playedCards.push(new Sponsors());
    player2.playedCards.push(new Sponsors());

    card.resolve(game, turmoil);
    expect(player.getTerraformRating()).to.eq(19);
    expect(player2.getTerraformRating()).to.eq(18);
  });

  it('doesn\'t reduce TR for players with 0 Earth tags + influence', function() {
    player2.playedCards.push(new Sponsors());

    card.resolve(game, turmoil);
    expect(player.getTerraformRating()).to.eq(20);
    expect(player2.getTerraformRating()).to.eq(18);
  });
});
