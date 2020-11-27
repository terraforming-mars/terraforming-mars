import {expect} from 'chai';
import {Revolution} from '../../src/turmoil/globalEvents/Revolution';
import {Player} from '../../src/Player';
import {Color} from '../../src/Color';
import {Game} from '../../src/Game';
import {Turmoil} from '../../src/turmoil/Turmoil';
import {Kelvinists} from '../../src/turmoil/parties/Kelvinists';
import {Sponsors} from '../../src/cards/base/Sponsors';

describe('Revolution', function() {
  let card : Revolution; let player : Player; let player2 : Player; let game : Game; let turmoil: Turmoil;

  beforeEach(function() {
    card = new Revolution();
    player = new Player('test', Color.BLUE, false);
    player2 = new Player('test2', Color.RED, false);

    game = new Game('foobar', [player, player2], player);
    turmoil = new Turmoil(game);

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
