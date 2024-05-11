import {expect} from 'chai';
import {setOxygenLevel} from '../../TestingUtils';
import {ColonizerTrainingCamp} from '../../../src/server/cards/base/ColonizerTrainingCamp';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('ColonizerTrainingCamp', function() {
  let card: ColonizerTrainingCamp;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new ColonizerTrainingCamp();
    [game, player] = testGame(2);
  });

  it('Can not play', function() {
    setOxygenLevel(game, 6);
    expect(card.canPlay(player)).is.not.true;
  });
  it('Should play', function() {
    setOxygenLevel(game, 5);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(card.getVictoryPoints(player)).to.eq(2);
  });
});
