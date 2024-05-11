import {expect} from 'chai';
import {Landlord} from '../../src/server/awards/Landlord';
import {SpaceName} from '../../src/server/SpaceName';
import {MoonExpansion} from '../../src/server/moon/MoonExpansion';
import {MoonSpaces} from '../../src/common/moon/MoonSpaces';
import {EmptyBoard} from '../ares/EmptyBoard';
import {_AresHazardPlacement} from '../../src/server/ares/AresHazards';
import {TileType} from '../../src/common/TileType';
import {LandClaim} from '../../src/server/cards/base/LandClaim';
import {addCity, addGreenery, cast, testGame} from '../TestingUtils';
import {SelectSpace} from '../../src/server/inputs/SelectSpace';

describe('Landlord', () => {
  const award = new Landlord();

  it('Simple test', () => {
    const [game, player/* , player2 */] = testGame(2, {aresExtension: true});
    game.board = EmptyBoard.newInstance();

    expect(award.getScore(player)).to.eq(0);

    addCity(player, SpaceName.NOCTIS_CITY);
    expect(award.getScore(player)).to.eq(1);

    addGreenery(player, '35');
    expect(award.getScore(player)).to.eq(2);
  });

  it('Includes The Moon', () => {
    const [/* game */, player/* , player2 */] = testGame(2, {moonExpansion: true});

    expect(award.getScore(player)).to.eq(0);

    addCity(player, SpaceName.NOCTIS_CITY);
    expect(award.getScore(player)).to.eq(1);

    addGreenery(player, '35');
    expect(award.getScore(player)).to.eq(2);

    MoonExpansion.addMineTile(player, MoonSpaces.MARE_IMBRIUM);
    expect(award.getScore(player)).to.eq(3);
  });

  it('Exclude Landclaimed Ares hazard tile from land-based award', function() {
    const [game, player/* , player2 */] = testGame(2, {aresExtension: true});

    const firstSpace = game.board.getAvailableSpacesOnLand(player)[0];
    _AresHazardPlacement.putHazardAt(firstSpace, TileType.DUST_STORM_MILD);

    expect(award.getScore(player)).to.eq(0);

    const card = new LandClaim();
    const action = cast(card.play(player), SelectSpace);
    action.cb(firstSpace);

    expect(firstSpace.player).to.eq(player);
    expect(firstSpace.tile?.tileType).is.eq(TileType.DUST_STORM_MILD);
    expect(award.getScore(player)).to.eq(0);
  });
});
