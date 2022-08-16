import {expect} from 'chai';
import {Player} from '../../../src/server/Player';
import {Game} from '../../../src/server/Game';
import {TileType} from '../../../src/common/TileType';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {NaturalPreserveAres} from '../../../src/server/cards/ares/NaturalPreserveAres';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {ARES_OPTIONS_NO_HAZARDS} from '../../ares/AresTestHelper';
import {TestPlayer} from '../../TestPlayer';
import {cast} from '../../TestingUtils';

describe('NaturalPreserveAres', function() {
  let card: NaturalPreserveAres;
  let player: Player;

  beforeEach(function() {
    card = new NaturalPreserveAres();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player, ARES_OPTIONS_NO_HAZARDS);
  });

  it('Should play', function() {
    expect(card.canPlay(player)).is.true;
    const action = cast(card.play(player), SelectSpace);
    const space = action.availableSpaces[0];
    action.cb(space);
    expect(space.tile && space.tile.tileType).to.eq(TileType.NATURAL_PRESERVE);
    expect(space.adjacency).to.deep.eq({bonus: [SpaceBonus.MEGACREDITS]});
  });
});
