import {expect} from 'chai';
import {RedTourismWave} from '../../../src/server/cards/turmoil/RedTourismWave';
import {SpaceName} from '../../../src/server/SpaceName';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {testGame} from '../../TestGame';

describe('RedTourismWave', function() {
  it('Should play', function() {
    const card = new RedTourismWave();
    const [game, player] = testGame(2, {turmoilExtension: true});
    expect(player.simpleCanPlay(card)).is.not.true;

    const reds = game.turmoil!.getPartyByName(PartyName.REDS);
    reds.delegates.add(player.id, 2);
    expect(player.simpleCanPlay(card)).is.true;

    const tharsis = game.board.getSpace(SpaceName.THARSIS_THOLUS);
    const lands = game.board.getAdjacentSpaces(tharsis).filter((space) => space.spaceType === SpaceType.LAND);
    game.addCityTile(player, lands[0]);
    card.play(player);
    expect(player.megaCredits).to.eq(3);
  });
});
