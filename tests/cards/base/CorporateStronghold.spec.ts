import {expect} from 'chai';
import {CorporateStronghold} from '../../../src/server/cards/base/CorporateStronghold';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TestPlayer} from '../../TestPlayer';
import {Resource} from '../../../src/common/Resource';
import {TileType} from '../../../src/common/TileType';
import {cast, runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('CorporateStronghold', function() {
  let card: CorporateStronghold;
  let player: TestPlayer;

  beforeEach(function() {
    card = new CorporateStronghold();
    [/* game */, player] = testGame(2);
    player.popWaitingFor(); // Removing SelectInitalCards.
  });

  it('Can not play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.production.add(Resource.ENERGY, 1);
    expect(card.canPlay(player)).is.true;

    expect(card.play(player)).is.undefined;
    runAllActions(player.game);
    const action = cast(player.popWaitingFor(), SelectSpace);
    action.cb(action.spaces[0]);

    expect(action.spaces[0].tile && action.spaces[0].tile.tileType).to.eq(TileType.CITY);
    expect(player.production.energy).to.eq(0);
    expect(player.production.megacredits).to.eq(3);

    expect(card.getVictoryPoints(player)).to.eq(-2);
  });
});
