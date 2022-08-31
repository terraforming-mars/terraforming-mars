import {expect} from 'chai';
import {CapitalAres} from '../../../src/server/cards/ares/CapitalAres';
import {TestPlayer} from '../../TestPlayer';
import {Game} from '../../../src/server/Game';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {Resources} from '../../../src/common/Resources';
import {TileType} from '../../../src/common/TileType';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {ARES_OPTIONS_NO_HAZARDS} from '../../ares/AresTestHelper';
import {cast} from '../../TestingUtils';

describe('CapitalAres', function() {
  let card: CapitalAres;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new CapitalAres();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player, ARES_OPTIONS_NO_HAZARDS);
  });

  it('Should play', function() {
    const oceanSpaces = game.board.getAvailableSpacesForOcean(player);
    for (let i = 0; i < 4; i++) {
      oceanSpaces[i].tile = {tileType: TileType.OCEAN};
    }
    player.production.add(Resources.ENERGY, 2);
    expect(card.canPlay(player)).is.true;

    const action = cast(card.play(player), SelectSpace);
    expect(player.production.energy).to.eq(0);
    expect(player.production.megacredits).to.eq(5);

    const citySpace = game.board.getAdjacentSpaces(oceanSpaces[0])[1];
    expect(citySpace.spaceType).to.eq(SpaceType.LAND);
    action.cb(citySpace);

    expect(citySpace.tile).is.not.undefined;
    expect(citySpace.player).to.eq(player);
    expect(citySpace.tile && citySpace.tile.tileType).to.eq(TileType.CAPITAL);
    expect(card.getVictoryPoints(player)).to.eq(1);
    expect(citySpace.adjacency).to.deep.eq({bonus: [SpaceBonus.MEGACREDITS, SpaceBonus.MEGACREDITS]});
  });
});
