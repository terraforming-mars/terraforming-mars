import {expect} from 'chai';
import {Game} from '../../src/Game';
import {Landlord} from '../../src/awards/Landlord';
import {TestPlayers} from '../TestPlayers';
import {SpaceName} from '../../src/SpaceName';
import {MoonExpansion} from '../../src/moon/MoonExpansion';
import {MoonSpaces} from '../../src/moon/MoonSpaces';
import {Player} from '../../src/Player';
import {ARES_OPTIONS_NO_HAZARDS} from '../ares/AresTestHelper';
import {EmptyBoard} from '../ares/EmptyBoard';
import {_AresHazardPlacement} from '../../src/ares/AresHazards';
import {TileType} from '../../src/TileType';
import {LandClaim} from '../../src/cards/base/LandClaim';
import {TestingUtils} from '../TestingUtils';

describe('Landlord', () => {
  let player: Player; let otherPlayer: Player; let game : Game;
  const award = new Landlord();

  beforeEach(function() {
    player = TestPlayers.BLUE.newPlayer();
    otherPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, otherPlayer], player, ARES_OPTIONS_NO_HAZARDS);
    game.board = EmptyBoard.newInstance();
  });

  it('Simple test', () => {
    expect(award.getScore(player)).to.eq(0);

    game.addCityTile(player, SpaceName.NOCTIS_CITY);
    expect(award.getScore(player)).to.eq(1);

    game.addGreenery(player, '35');
    expect(award.getScore(player)).to.eq(2);
  });

  it('Includes The Moon', () => {
    const game = Game.newInstance('foobar', [player, otherPlayer], player, TestingUtils.setCustomGameOptions({moonExpansion: true}));

    expect(award.getScore(player)).to.eq(0);

    game.addCityTile(player, SpaceName.NOCTIS_CITY);
    expect(award.getScore(player)).to.eq(1);

    game.addGreenery(player, '35');
    expect(award.getScore(player)).to.eq(2);

    MoonExpansion.addMineTile(player, MoonSpaces.MARE_IMBRIUM);
    expect(award.getScore(player)).to.eq(3);
  });

  it('Exclude Landclaimed Ares hazard tile from land-based award', function() {
    const game = Game.newInstance('foobar', [player, otherPlayer], player, TestingUtils.setCustomGameOptions({aresExtension: true}));

    const firstSpace = game.board.getAvailableSpacesOnLand(player)[0];
    _AresHazardPlacement.putHazardAt(firstSpace, TileType.DUST_STORM_MILD);

    expect(award.getScore(player)).to.eq(0);

    const card = new LandClaim();
    const action = card.play(player);
    expect(action).is.not.undefined;
    action.cb(firstSpace);

    expect(firstSpace.player).to.eq(player);
    expect(firstSpace.tile?.tileType).is.eq(TileType.DUST_STORM_MILD);
    expect(award.getScore(player)).to.eq(0);
  });
});
