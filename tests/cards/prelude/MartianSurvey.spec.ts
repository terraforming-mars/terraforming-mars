import {expect} from 'chai';
import {MartianSurvey} from '../../../src/server/cards/prelude/MartianSurvey';
import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('MartianSurvey', function() {
  let card: MartianSurvey;
  let player: Player;
  let game: Game;

  beforeEach(function() {
    card = new MartianSurvey();
    player = TestPlayer.BLUE.newPlayer();
    game = Game.newInstance('gameid', [player], player);
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
