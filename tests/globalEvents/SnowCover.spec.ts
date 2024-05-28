import {expect} from 'chai';
import {setTemperature} from '../TestingUtils';
import {MAX_TEMPERATURE} from '../../src/common/constants';
import {IGame} from '../../src/server/IGame';
import {SnowCover} from '../../src/server/turmoil/globalEvents/SnowCover';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/server/turmoil/Turmoil';
import {TestPlayer} from '../TestPlayer';
import {testGame} from '../TestGame';

describe('SnowCover', function() {
  let card: SnowCover;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;
  let turmoil: Turmoil;

  beforeEach(function() {
    card = new SnowCover();
    [game, player, player2] = testGame(2);

    turmoil = Turmoil.newInstance(game);
    turmoil.chairman = player2;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2;
    turmoil.dominantParty.delegates.add(player2);
    turmoil.dominantParty.delegates.add(player2);
  });

  it('resolve play', function() {
    card.resolve(game, turmoil);
    expect(player2.cardsInHand).has.lengthOf(3);
    expect(game.getTemperature()).to.eq(-30);

    game.increaseTemperature(player, 1);
    card.resolve(game, turmoil);
    expect(game.getTemperature()).to.eq(-30);

    game.increaseTemperature(player, 2);
    card.resolve(game, turmoil);
    expect(game.getTemperature()).to.eq(-30);

    game.increaseTemperature(player, 3);
    card.resolve(game, turmoil);
    expect(game.getTemperature()).to.eq(-28);
  });

  it('cannot reduce temperature if maxed out', function() {
    setTemperature(game, MAX_TEMPERATURE);
    card.resolve(game, turmoil);
    expect(game.getTemperature()).to.eq(MAX_TEMPERATURE);
  });
});
