import {expect} from 'chai';
import {setTemperature} from '../../TestingUtils';
import {TundraFarming} from '../../../src/server/cards/base/TundraFarming';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('TundraFarming', function() {
  let card: TundraFarming;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new TundraFarming();
    [game, player] = testGame(2);
  });

  it('Can not play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    setTemperature(game, -6);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.production.plants).to.eq(1);
    expect(player.production.megacredits).to.eq(2);
    expect(player.plants).to.eq(1);

    expect(card.getVictoryPoints(player)).to.eq(2);
  });
});
