import {expect} from 'chai';
import {RedTourismWave} from '../../../src/cards/turmoil/RedTourismWave';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/common/Resources';
import {SpaceName} from '../../../src/SpaceName';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {setCustomGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

describe('RedTourismWave', function() {
  it('Should play', function() {
    const card = new RedTourismWave();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    const gameOptions = setCustomGameOptions();
    const game = Game.newInstance('gameid', [player, redPlayer], player, gameOptions);
    expect(player.canPlayIgnoringCost(card)).is.not.true;

    const reds = game.turmoil!.getPartyByName(PartyName.REDS)!;
    reds.delegates.push(player.id, player.id);
    expect(player.canPlayIgnoringCost(card)).is.true;

    const tharsis = game.board.getSpace(SpaceName.THARSIS_THOLUS);
    const lands = game.board.getAdjacentSpaces(tharsis).filter((space) => space.spaceType === SpaceType.LAND);
    game.addCityTile(player, lands[0].id);
    card.play(player);
    expect(player.getResource(Resources.MEGACREDITS)).to.eq(3);
  });
});
