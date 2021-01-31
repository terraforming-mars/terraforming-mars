import {expect} from 'chai';
import {RedTourismWave} from '../../../src/cards/turmoil/RedTourismWave';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {SpaceName} from '../../../src/SpaceName';
import {SpaceType} from '../../../src/SpaceType';
import {PartyName} from '../../../src/turmoil/parties/PartyName';
import {setCustomGameOptions, TestPlayers} from '../../TestingUtils';

describe('RedTourismWave', function() {
  it('Should play', function() {
    const card = new RedTourismWave();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const gameOptions = setCustomGameOptions();
    const game = Game.newInstance('foobar', [player, redPlayer], player, gameOptions);
    expect(card.canPlay(player)).is.not.true;

    const reds = game.turmoil!.getPartyByName(PartyName.REDS)!;
    reds.delegates.push(player.id, player.id);
    expect(card.canPlay(player)).is.true;

    const tharsis = game.board.getSpace(SpaceName.THARSIS_THOLUS);
    const lands = game.board.getAdjacentSpaces(tharsis).filter((space) => space.spaceType === SpaceType.LAND);
    game.addCityTile(player, lands[0].id);
    card.play(player);
    expect(player.getResource(Resources.MEGACREDITS)).to.eq(3);
  });
});
