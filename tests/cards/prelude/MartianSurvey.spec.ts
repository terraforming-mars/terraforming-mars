import {expect} from 'chai';
import {MartianSurvey} from '../../../src/cards/prelude/MartianSurvey';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestingUtils';

describe('MartianSurvey', function() {
  let card : MartianSurvey; let player : Player; let game : Game;

  beforeEach(function() {
    card = new MartianSurvey();
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('foobar', [player], player);
  });

  it('Can\'t play', function() {
    (game as any).oxygenLevel = 5;
    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Should play', function() {
    expect(card.canPlay(player, game)).is.true;
    card.play(player, game);
    expect(game.deferredActions).has.lengthOf(1);

    // Draw cards
    game.deferredActions.runNext();

    expect(card.getVictoryPoints()).to.eq(1);
    expect(player.cardsInHand).has.lengthOf(2);
  });
});
