import {expect} from 'chai';
import {MartianSurvey} from '../../../src/cards/prelude/MartianSurvey';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('MartianSurvey', function() {
  let card : MartianSurvey; let player : Player; let game : Game;

  beforeEach(function() {
    card = new MartianSurvey();
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('foobar', [player], player);
  });

  it('Cannot play', () => {
    (game as any).oxygenLevel = 5;
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });
  it('Can play', () => {
    (game as any).oxygenLevel = 4;
    expect(player.canPlayIgnoringCost(card)).is.true;
  });

  it('Should play', () => {
    expect(player.canPlayIgnoringCost(card)).is.true;
    card.play(player);

    expect(card.getVictoryPoints()).to.eq(1);
    expect(player.cardsInHand).has.lengthOf(2);
  });
});
