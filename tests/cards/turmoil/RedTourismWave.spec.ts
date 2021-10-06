import {expect} from 'chai';
import {RedTourismWave} from '../../../src/cards/turmoil/RedTourismWave';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {SpaceName} from '../../../src/SpaceName';
import {SpaceType} from '../../../src/SpaceType';
import {PartyName} from '../../../src/turmoil/parties/PartyName';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('RedTourismWave', function() {
  it('Should play', function() {
    const card = new RedTourismWave();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const gameOptions = TestingUtils.setCustomGameOptions();
    const game = Game.newInstance('foobar', [player, redPlayer], player, gameOptions);
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
