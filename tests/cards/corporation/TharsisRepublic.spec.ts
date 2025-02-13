import {expect} from 'chai';
import {TharsisRepublic} from '../../../src/server/cards/corporation/TharsisRepublic';
import {IGame} from '../../../src/server/IGame';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {TileType} from '../../../src/common/TileType';
import {addCity, cast, runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {testGame} from '../../TestGame';

describe('TharsisRepublic', () => {
  let card: TharsisRepublic;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new TharsisRepublic();
    [game, player, player2] = testGame(2);

    player.corporations.push(card);
  });

  it('Should take initial action', () => {
    player.deferInitialAction(card);
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectSpace);
    action.cb(action.spaces[0]);
    runAllActions(game);

    expect(game.board.getCitiesOnMars()).has.length(1);
    expect(player.production.megacredits).to.eq(1);
    expect(player.megaCredits).to.eq(3);
  });

  it('Gives 3 M€ and MC production for own city on Mars', () => {
    addCity(player);
    runAllActions(game);

    expect(player.megaCredits).to.eq(3);
    expect(player.production.megacredits).to.eq(1);
  });

  it('Gives MC production only for other player\'s city on Mars', () => {
    addCity(player2);
    runAllActions(game);

    expect(player.megaCredits).to.eq(0);
    expect(player.production.megacredits).to.eq(1);
  });

  it('Does not give MC production for own city off Mars', () => {
    game.addTile(player, game.board.spaces.find((space) => space.spaceType === SpaceType.COLONY)!, {
      tileType: TileType.CITY,
    });
    runAllActions(game);
    expect(player.production.megacredits).to.eq(0);
  });

  it('Gives 2 M€ production in solo mode', () => {
    [game, player] = testGame(1);
    card.play(player);
    runAllActions(game);
    expect(player.production.megacredits).to.eq(2);
  });
});
