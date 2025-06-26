import {expect} from 'chai';
import {TunnelingSubcontractor} from '../../../src/server/cards/underworld/TunnelingSubcontractor';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {Units} from '../../../src/common/Units';

describe('TunnelingSubcontractor', () => {
  it('Should play', () => {
    const card = new TunnelingSubcontractor();
    const [game, player] = testGame(2, {underworldExpansion: true});

    player.underworldData.corruption = 0;

    cast(card.play(player), undefined);
    runAllActions(game);

    expect(player.underworldData.corruption).to.eq(1);

    const selectSpace1 = cast(player.popWaitingFor(), SelectSpace);
    const space1 = selectSpace1.spaces[0];
    // Simplify the test by forcing the space to have an easy-to-manage-resource.
    space1.undergroundResources = 'plant1';
    selectSpace1.cb(space1);

    expect(player.stock.asUnits()).deep.eq(Units.of({plants: 1}));
    expect(space1.excavator).eq(player);

    runAllActions(game);

    cast(player.popWaitingFor(), undefined);
  });
});
