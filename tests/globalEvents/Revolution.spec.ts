import {expect} from 'chai';
import {Sponsors} from '../../src/server/cards/base/Sponsors';
import {IGame} from '../../src/server/IGame';
import {Revolution} from '../../src/server/turmoil/globalEvents/Revolution';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/server/turmoil/Turmoil';
import {TestPlayer} from '../TestPlayer';
import {testGame} from '../TestingUtils';

describe('Revolution', function() {
  let card: Revolution;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;
  let turmoil: Turmoil;

  beforeEach(function() {
    card = new Revolution();
    [game, player, player2] = testGame(2, {turmoilExtension: true});
    turmoil = game.turmoil!;
    turmoil.chairman = player2;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2;
    turmoil.dominantParty.delegates.add(player2);
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
