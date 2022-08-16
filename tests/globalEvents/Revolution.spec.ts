import {expect} from 'chai';
import {Sponsors} from '../../src/server/cards/base/Sponsors';
import {Game} from '../../src/server/Game';
import {Player} from '../../src/server/Player';
import {Revolution} from '../../src/server/turmoil/globalEvents/Revolution';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/server/turmoil/Turmoil';
import {TestPlayer} from '../TestPlayer';

describe('Revolution', function() {
  let card: Revolution;
  let player: Player;
  let player2: Player;
  let game: Game;
  let turmoil: Turmoil;

  beforeEach(function() {
    card = new Revolution();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();

    game = Game.newInstance('gameid', [player, player2], player);
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

  it('doesn not reduce TR for players with 0 Earth tags + influence', function() {
    player2.playedCards.push(new Sponsors());

    card.resolve(game, turmoil);
    expect(player.getTerraformRating()).to.eq(20);
    expect(player2.getTerraformRating()).to.eq(18);
  });
});
