import {expect} from 'chai';
import {CommercialDistrict} from '../../../src/server/cards/base/CommercialDistrict';
import {IGame} from '../../../src/server/IGame';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {Resource} from '../../../src/common/Resource';
import {TileType} from '../../../src/common/TileType';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('CommercialDistrict', function() {
  let card: CommercialDistrict;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new CommercialDistrict();
    [game, player] = testGame(2);
  });

  it('Can not play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.production.add(Resource.ENERGY, 1);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectSpace);
    action.cb(action.spaces[0]);

    expect(player.production.energy).to.eq(0);
    expect(player.production.megacredits).to.eq(4);

    const adjacent = game.board.getAdjacentSpaces(action.spaces[0]);
    adjacent[0].tile = {tileType: TileType.CITY, card: card.name};
    adjacent[0].player = player;
    expect(card.getVictoryPoints(player)).to.eq(1);
    expect(action.spaces[0].adjacency?.bonus).eq(undefined);
  });
});
