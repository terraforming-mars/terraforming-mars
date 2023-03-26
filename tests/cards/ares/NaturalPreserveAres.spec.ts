import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {TileType} from '../../../src/common/TileType';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {NaturalPreserveAres} from '../../../src/server/cards/ares/NaturalPreserveAres';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {ARES_OPTIONS_NO_HAZARDS} from '../../ares/AresTestHelper';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('NaturalPreserveAres', function() {
  let card: NaturalPreserveAres;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new NaturalPreserveAres();
    [game, player] = testGame(2, ARES_OPTIONS_NO_HAZARDS);
  });

  it('Should play', function() {
    expect(card.canPlay(player)).is.true;
    card.play(player);
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectSpace);
    const space = action.availableSpaces[0];
    action.cb(space);
    expect(space.tile && space.tile.tileType).to.eq(TileType.NATURAL_PRESERVE);
    expect(space.adjacency).to.deep.eq({bonus: [SpaceBonus.MEGACREDITS]});
  });
});
