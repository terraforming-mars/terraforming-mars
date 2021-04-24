import {expect} from 'chai';
import {CommercialDistrict} from '../../../src/cards/base/CommercialDistrict';
import {Game} from '../../../src/Game';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TileType} from '../../../src/TileType';
import {TestPlayers} from '../../TestPlayers';

describe('CommercialDistrict', function() {
  let card : CommercialDistrict; let player : Player; let game : Game;

  beforeEach(function() {
    card = new CommercialDistrict();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.addProduction(Resources.ENERGY, 1);
    expect(card.canPlay(player)).is.true;

    const action = card.play(player);
    expect(action instanceof SelectSpace);
    action.cb(action.availableSpaces[0]);

    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(4);

    const adjacent = game.board.getAdjacentSpaces(action.availableSpaces[0]);
    adjacent[0].tile = {tileType: TileType.CITY, card: card.name};
    adjacent[0].player = player;
    expect(card.getVictoryPoints(player)).to.eq(1);
    expect(action.availableSpaces[0].adjacency?.bonus).eq(undefined);
  });
});
