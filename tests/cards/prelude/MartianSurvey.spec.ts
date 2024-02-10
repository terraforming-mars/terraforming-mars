import {expect} from 'chai';
import {setOxygenLevel} from '../../TestingUtils';
import {MartianSurvey} from '../../../src/server/cards/prelude/MartianSurvey';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('MartianSurvey', function() {
  let card: MartianSurvey;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new MartianSurvey();
    player = TestPlayer.BLUE.newPlayer();
    game = Game.newInstance('gameid', [player], player);
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
