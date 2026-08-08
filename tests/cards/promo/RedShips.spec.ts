import {expect} from 'chai';
import {RedShips} from '@/server/cards/promo/RedShips';
import {TileType} from '@/common/TileType';
import {IGame} from '@/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {addCity, addOcean, setOxygenLevel} from '../../TestingUtils';

describe('RedShips', () => {
  let card: RedShips;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new RedShips();
    [game, player, player2] = testGame(2);
  });

  it('canPlay', () => {
    setOxygenLevel(game, 3);
    expect(card.canPlay(player)).is.false;

    setOxygenLevel(game, 4);
    expect(card.canPlay(player)).is.true;
  });

  it('canAct', () => {
    expect(card.canAct()).is.true;
  });

  it('action with no qualifying tiles adds nothing', () => {
    card.action(player);
    expect(player.megaCredits).to.eq(0);
  });

  it('action counts city tiles adjacent to an ocean', () => {
    const oceanSpace = addOcean(player);
    const citySpace = game.board.getAdjacentSpaces(oceanSpace)[0];
    addCity(player, citySpace.id);

    player.megaCredits = 0;
    card.action(player);
    expect(player.megaCredits).to.eq(1);
  });

  it('action counts special tiles adjacent to an ocean', () => {
    const oceanSpace = addOcean(player);
    const specialSpace = game.board.getAdjacentSpaces(oceanSpace)[0];
    specialSpace.tile = {tileType: TileType.NATURAL_PRESERVE};

    player.megaCredits = 0;
    card.action(player);
    expect(player.megaCredits).to.eq(1);
  });

  it('action does not count city/special tiles that are not adjacent to an ocean', () => {
    addCity(player);

    player.megaCredits = 0;
    card.action(player);
    expect(player.megaCredits).to.eq(0);
  });

  it('action counts qualifying tiles regardless of owner', () => {
    const oceanSpace = addOcean(player);
    const citySpace = game.board.getAdjacentSpaces(oceanSpace)[0];
    addCity(player2, citySpace.id);

    player.megaCredits = 0;
    card.action(player);
    expect(player.megaCredits).to.eq(1);
  });
});
