import {expect} from 'chai';
import {Game} from '../../src/Game';
import {Landlord} from '../../src/awards/Landlord';
import {TestPlayers} from '../TestPlayers';
import {SpaceName} from '../../src/SpaceName';
import {MoonExpansion} from '../../src/moon/MoonExpansion';
import {MoonSpaces} from '../../src/moon/MoonSpaces';
import {TestingUtils} from '../TestingUtils';

describe('Lanbdlord', () => {
  it('Simple test', () => {
    const award = new Landlord();
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, player2], player);

    expect(award.getScore(player)).to.eq(0);

    game.addCityTile(player, SpaceName.NOCTIS_CITY);

    expect(award.getScore(player)).to.eq(1);

    game.addGreenery(player, '35');

    expect(award.getScore(player)).to.eq(2);
  });

  it('Includes The Moon', () => {
    const award = new Landlord();
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, player2], player, TestingUtils.setCustomGameOptions({moonExpansion: true}));

    expect(award.getScore(player)).to.eq(0);

    game.addCityTile(player, SpaceName.NOCTIS_CITY);

    expect(award.getScore(player)).to.eq(1);

    game.addGreenery(player, '35');

    expect(award.getScore(player)).to.eq(2);

    MoonExpansion.addMineTile(player, MoonSpaces.MARE_IMBRIUM);

    expect(award.getScore(player)).to.eq(3);
  });
});
