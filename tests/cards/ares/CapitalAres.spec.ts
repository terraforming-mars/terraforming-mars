import {expect} from 'chai';
import {CapitalAres} from '../../../src/cards/ares/CapitalAres';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {SpaceType} from '../../../src/SpaceType';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {Resources} from '../../../src/Resources';
import {TileType} from '../../../src/TileType';
import {SpaceBonus} from '../../../src/SpaceBonus';
import {ARES_OPTIONS_NO_HAZARDS} from '../../ares/AresTestHelper';
import {TestPlayers} from '../../TestingUtils';

describe('CapitalAres', function() {
  let card : CapitalAres; let blue : Player; let game : Game;

  beforeEach(function() {
    card = new CapitalAres();
    blue = TestPlayers.BLUE.newPlayer();
    game = new Game('foobar', [blue, blue], blue, ARES_OPTIONS_NO_HAZARDS);
  });

  it('Should play', function() {
    const oceanSpaces = game.board.getAvailableSpacesForOcean(blue);
    for (let i = 0; i < 4; i++) {
      oceanSpaces[i].tile = {tileType: TileType.OCEAN};
    }
    blue.addProduction(Resources.ENERGY, 2);
    expect(card.canPlay(blue, game)).is.true;

    const action = card.play(blue, game);
    expect(action instanceof SelectSpace).is.true;
    expect(blue.getProduction(Resources.ENERGY)).to.eq(0);
    expect(blue.getProduction(Resources.MEGACREDITS)).to.eq(5);

    const citySpace = game.board.getAdjacentSpaces(oceanSpaces[0])[0];
    expect(citySpace.spaceType).to.eq(SpaceType.LAND);
    action.cb(citySpace);

    expect(citySpace.tile).is.not.undefined;
    expect(citySpace.player).to.eq(blue);
    expect(citySpace.tile && citySpace.tile.tileType).to.eq(TileType.CAPITAL);
    expect(blue.victoryPointsBreakdown.victoryPoints).to.eq(0);
    expect(card.getVictoryPoints(blue, game)).to.eq(1);
    expect(citySpace.adjacency).to.deep.eq({bonus: [SpaceBonus.MEGACREDITS, SpaceBonus.MEGACREDITS]});
  });
});
