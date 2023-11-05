import {EarlySettlement} from '../../../src/server/cards/prelude/EarlySettlement';
import {runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';
import {UnderworldTestHelper} from '../../underworld/UnderworldTestHelper';

describe('EarlySettlement', function() {
  it('Should play', function() {
    const card = new EarlySettlement();
    const [game, player] = testGame(1);

    card.play(player);
    runAllActions(game);

    UnderworldTestHelper.assertPlaceCity(player, player.popWaitingFor());
  });
});
