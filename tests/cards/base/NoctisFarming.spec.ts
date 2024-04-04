import {expect} from 'chai';
import {setTemperature} from '../../TestingUtils';
import {NoctisFarming} from '../../../src/server/cards/base/NoctisFarming';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('NoctisFarming', function() {
  let card: NoctisFarming;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new NoctisFarming();
    [game, player] = testGame(2);
  });

  it('Can not play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    setTemperature(game, -20);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.production.megacredits).to.eq(1);
    expect(player.plants).to.eq(2);

    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});
