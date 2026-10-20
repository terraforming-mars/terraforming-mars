import {expect} from 'chai';
import {Deimos} from '../../src/server/colonies/Deimos';
import {AresHazards} from '../../src/server/ares/AresHazards';
import {TileType} from '../../src/common/TileType';
import {IGame} from '../../src/server/IGame';
import {EmptyBoard} from '../testing/EmptyBoard';
import {testGame} from '../TestGame';
import {TestPlayer} from '../TestPlayer';
import {formatMessage, runAllActions} from '../TestingUtils';

describe('Deimos', () => {
  let deimos: Deimos;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    deimos = new Deimos();
    [game, player] = testGame(2, {aresExtension: true});
    game.board = EmptyBoard.newInstance();
    game.colonies.push(deimos);
  });

  it('colony bonus gives 1 M€ per hazard tile and logs it', () => {
    const [space1, space2, space3] = game.board.getAvailableSpacesOnLand(player);
    AresHazards.putHazardAt(game, space1, TileType.EROSION_MILD);
    AresHazards.putHazardAt(game, space2, TileType.DUST_STORM_SEVERE);
    AresHazards.putHazardAt(game, space3, TileType.EROSION_SEVERE);
    player.megaCredits = 0;
    game.gameLog.length = 0;

    deimos.giveColonyBonus(player);
    runAllActions(game);

    expect(player.megaCredits).eq(3);
    expect(game.gameLog.map(formatMessage)).deep.eq(['blue gained 3:r:megacredits:']);
  });

  it('colony bonus with no hazard tiles gives nothing and logs nothing', () => {
    player.megaCredits = 0;
    game.gameLog.length = 0;

    deimos.giveColonyBonus(player);
    runAllActions(game);

    expect(player.megaCredits).eq(0);
    expect(game.gameLog).is.empty;
  });
});
