import {expect} from 'chai';
import {setTemperature} from '../../TestingUtils';
import {DesignedMicroOrganisms} from '../../../src/server/cards/base/DesignedMicroOrganisms';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('DesignedMicroOrganisms', function() {
  let card: DesignedMicroOrganisms;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new DesignedMicroOrganisms();
    [game, player] = testGame(2);
  });

  it('Cannot play', function() {
    setTemperature(game, -12);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can play', function() {
    setTemperature(game, -14);
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', function() {
    setTemperature(game, -14);
    expect(card.canPlay(player)).is.true;
    card.play(player);
    expect(player.production.plants).to.eq(2);
  });
});
