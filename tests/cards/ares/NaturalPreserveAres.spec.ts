import {expect} from 'chai';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {TileType} from '../../../src/common/TileType';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {NaturalPreserveAres} from '../../../src/cards/ares/NaturalPreserveAres';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {ARES_OPTIONS_NO_HAZARDS} from '../../ares/AresTestHelper';
import {TestPlayers} from '../../TestPlayers';

describe('NaturalPreserveAres', function() {
  let card : NaturalPreserveAres; let player : Player;

  beforeEach(function() {
    card = new NaturalPreserveAres();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player, ARES_OPTIONS_NO_HAZARDS);
  });

  it('Should play', function() {
    expect(card.canPlay(player)).is.true;
    const action = card.play(player);
    expect(action).is.not.undefined;
    expect(action).instanceOf(SelectSpace);

    const space = action.availableSpaces[0];
    action.cb(space);
    expect(space.tile && space.tile.tileType).to.eq(TileType.NATURAL_PRESERVE);
    expect(space.adjacency).to.deep.eq({bonus: [SpaceBonus.MEGACREDITS]});
  });
});
