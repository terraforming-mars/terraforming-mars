import {expect} from 'chai';
import {RedTourismWave} from '../../../src/server/cards/turmoil/RedTourismWave';
import {IGame} from '../../../src//server/IGame';
import {SpaceName} from '../../../src/common/boards/SpaceName';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';

describe('RedTourismWave', () => {
  let card: RedTourismWave;
  let game: IGame;
  let player: TestPlayer;

  beforeEach(() => {
    card = new RedTourismWave();
    [game, player] = testGame(2, {turmoilExtension: true});
  });

  it('Can play', () => {
    expect(card.canPlay(player)).is.not.true;

    const reds = game.turmoil!.getPartyByName(PartyName.REDS);
    reds.delegates.add(player, 2);
    expect(card.canPlay(player)).is.true;
  });

  it('play', () => {
    const tharsis = game.board.getSpaceOrThrow(SpaceName.THARSIS_THOLUS);
    const lands = game.board.getAdjacentSpaces(tharsis).filter((space) => space.spaceType === SpaceType.LAND);
    game.addCity(player, lands[0]);
    card.play(player);
    expect(player.megaCredits).to.eq(3);
  });
});
