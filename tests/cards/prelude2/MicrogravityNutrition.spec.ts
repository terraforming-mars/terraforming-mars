import {MicrogravityNutrition} from '../../../src/server/cards/prelude2/MicrogravityNutrition';
import {Luna} from '../../../src/server/colonies/Luna';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestingUtils';

describe('MicrogravityNutrition', function() {
  // let card: MicrogravityNutrition;
  let player: TestPlayer;
  let game: IGame;
  let colony1: Luna;

  beforeEach(function() {
    // card = new MicrogravityNutrition();
    [game, player/* , player2 */] = testGame(2, {coloniesExtension: true});

    colony1 = new Luna();
    colony1.colonies.push(player.id);
    player.game.colonies.push(colony1);
  });

});
