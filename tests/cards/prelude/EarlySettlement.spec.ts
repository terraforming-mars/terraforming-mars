import {EarlySettlement} from '../../../src/server/cards/prelude/EarlySettlement';
import {runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';
import {assertPlaceCity} from '../../assertions';

describe('EarlySettlement', () => {
  it('Should play', () => {
    const card = new EarlySettlement();
    const [game, player] = testGame(1);

    card.play(player);
    runAllActions(game);

    assertPlaceCity(player, player.popWaitingFor());
  });
});
