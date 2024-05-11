import {expect} from 'chai';
import {setTemperature} from '../../TestingUtils';
import {Heather} from '../../../src/server/cards/base/Heather';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('Heather', function() {
  let card: Heather;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new Heather();
    [game, player] = testGame(2);
  });

  it('Can not play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    setTemperature(game, -14);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.production.plants).to.eq(1);
    expect(player.plants).to.eq(1);
  });
});
