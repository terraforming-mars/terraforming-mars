import {expect} from 'chai';
import {RedTourismWave} from '../../../src/server/cards/turmoil/RedTourismWave';
import {Game} from '../../../src//server/Game';
import {SpaceName} from '../../../src/server/SpaceName';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {testGame} from '../../TestGame';
import {TestPlayer} from 'tests/TestPlayer';

describe('RedTourismWave', function() {
  let card: RedTourismWave;
  let game: Game;
  let player: TestPlayer;

  beforeEach(() => {
    card = new RedTourismWave();
    [game, player] = testGame(2, {turmoilExtension: true});
  });

  it('Can play', function() {
    expect(card.canPlay(player)).is.not.true;

    const reds = game.turmoil!.getPartyByName(PartyName.REDS);
    reds.delegates.add(player, 2);
    expect(card.canPlay(player)).is.true;
  });

  it('play', function() {
    const tharsis = game.board.getSpace(SpaceName.THARSIS_THOLUS);
    const lands = game.board.getAdjacentSpaces(tharsis).filter((space) => space.spaceType === SpaceType.LAND);
    game.addCity(player, lands[0]);
    card.play(player);
    expect(player.megaCredits).to.eq(3);
  });
});
