import {expect} from 'chai';
import {Poseidon} from '../../../src/server/cards/colonies/Poseidon';
import {Ceres} from '../../../src/server/colonies/Ceres';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {SelectColony} from '../../../src/server/inputs/SelectColony';

describe('Poseidon', function() {
  it('Should play', function() {
    const card = new Poseidon();
    const [/* game */, player/* , player2 */] = testGame(2);

    cast(card.play(player), undefined);

    player.setCorporationForTest(card);
    const ceres = new Ceres();
    ceres.addColony(player);

    expect(player.production.megacredits).to.eq(1);
    expect(player.production.steel).to.eq(1);
  });

  it('initial action', () => {
    const card = new Poseidon();
    const [game, player/* , player2 */] = testGame(2, {coloniesExtension: true});

    player.deferInitialAction(card);
    runAllActions(game);

    const selectColony = cast(player.popWaitingFor(), SelectColony);
    const colony = selectColony.colonies[0];
    expect(colony.colonies).is.empty;

    selectColony.cb(colony);

    expect(colony.colonies).deep.eq([player.id]);
  });
});
