import {GreatAquifer} from '../../../src/server/cards/prelude/GreatAquifer';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {assertPlaceOcean} from '../../assertions';

describe('GreatAquifer', () => {
  it('Should play', () => {
    const card = new GreatAquifer();
    const [game, player] = testGame(2);
    cast(card.play(player), undefined);

    runAllActions(game);
    assertPlaceOcean(player, player.popWaitingFor());
    runAllActions(game);
    assertPlaceOcean(player, player.popWaitingFor());
    runAllActions(game);
    cast(player.popWaitingFor(), undefined);
  });
});
