import {expect} from 'chai';
import {Capital} from '../../../src/server/cards/base/Capital';
import {TestPlayer} from '../../TestPlayer';
import {IGame} from '../../../src/server/IGame';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {TileType} from '../../../src/common/TileType';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {Resource} from '../../../src/common/Resource';
import {cast, maxOutOceans, runAllActions} from '../../TestingUtils';
import {Board} from '../../../src/server/boards/Board';
import {testGame} from '../../TestGame';

describe('Capital', () => {
  let card: Capital;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new Capital();
    [game, player] = testGame(2);
  });

  it('Cannot play without 2 energy production', () => {
    maxOutOceans(player, 4);
    player.production.add(Resource.ENERGY, 1);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Cannot play if oceans requirement not met', () => {
    maxOutOceans(player, 3);
    player.production.add(Resource.ENERGY, 2);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can play', () => {
    maxOutOceans(player, 4);
    player.production.add(Resource.ENERGY, 2);
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', () => {
    const oceanSpaces = game.board.getAvailableSpacesForOcean(player);
    for (let i = 0; i < 4; i++) {
      oceanSpaces[i].tile = {tileType: TileType.OCEAN};
    }
    player.production.add(Resource.ENERGY, 2);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectSpace);
    expect(player.production.energy).to.eq(0);
    expect(player.production.megacredits).to.eq(5);

    const citySpace = game.board.getAdjacentSpaces(oceanSpaces[0])[1];
    expect(citySpace.spaceType).to.eq(SpaceType.LAND);
    action.cb(citySpace);

    expect(citySpace.player).to.eq(player);
    expect(citySpace.tile?.tileType).to.eq(TileType.CAPITAL);
    expect(card.getVictoryPoints(player)).to.eq(1);
    expect(citySpace.adjacency?.bonus).eq(undefined);
  });

  it('Capital special tile counts as a city', () => {
    const space = game.board.getNthAvailableLandSpace(2, 1, player);
    game.addTile(player, space, {
      tileType: TileType.CAPITAL,
      card: card.name,
    });

    // cover main functions
    expect(Board.isCitySpace(space)).is.true;
    expect(game.board.getCitiesOnMars()).has.length(1);
    expect(game.board.getCities()).has.length(1);

    // check VP
    const greenerySpace = game.board.getAdjacentSpaces(space).find((space) => space.spaceType === SpaceType.LAND);
    game.addGreenery(player, greenerySpace!);
    expect(player.getVictoryPoints().city).to.eq(1); // 1 VP for Capital city
  });
});
