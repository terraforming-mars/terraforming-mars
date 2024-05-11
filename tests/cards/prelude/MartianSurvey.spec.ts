import {expect} from 'chai';
import {setOxygenLevel} from '../../TestingUtils';
import {MartianSurvey} from '../../../src/server/cards/prelude/MartianSurvey';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestingUtils';

describe('MartianSurvey', function() {
  let card: MartianSurvey;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new MartianSurvey();
    [game, player] = testGame(1);
  });

  it('Cannot play', () => {
    setOxygenLevel(game, 5);
    expect(card.canPlay(player)).is.not.true;
  });
  it('Can play', () => {
    setOxygenLevel(game, 4);
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', () => {
    expect(card.canPlay(player)).is.true;
    card.play(player);

    expect(card.getVictoryPoints(player)).to.eq(1);
    expect(player.cardsInHand).has.lengthOf(2);
  });
});
