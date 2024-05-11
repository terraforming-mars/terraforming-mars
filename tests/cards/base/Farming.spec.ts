import {expect} from 'chai';
import {setTemperature} from '../../TestingUtils';
import {Farming} from '../../../src/server/cards/base/Farming';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('Farming', function() {
  let card: Farming;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new Farming();
    [game, player] = testGame(2);
  });

  it('Can not play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    setTemperature(game, 4);
    expect(card.canPlay(player)).is.true;
    card.play(player);

    expect(player.production.megacredits).to.eq(2);
    expect(player.production.plants).to.eq(2);
    expect(player.plants).to.eq(2);

    expect(card.getVictoryPoints(player)).to.eq(2);
  });
});
