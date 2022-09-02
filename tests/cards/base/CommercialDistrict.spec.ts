import {expect} from 'chai';
import {CommercialDistrict} from '../../../src/server/cards/base/CommercialDistrict';
import {Game} from '../../../src/server/Game';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {Resources} from '../../../src/common/Resources';
import {TileType} from '../../../src/common/TileType';
import {TestPlayer} from '../../TestPlayer';
import {cast} from '../../TestingUtils';

describe('CommercialDistrict', function() {
  let card: CommercialDistrict;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new CommercialDistrict();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.production.add(Resources.ENERGY, 1);
    expect(card.canPlay(player)).is.true;

    const action = cast(card.play(player), SelectSpace);
    action.cb(action.availableSpaces[0]);

    expect(player.production.energy).to.eq(0);
    expect(player.production.megacredits).to.eq(4);

    const adjacent = game.board.getAdjacentSpaces(action.availableSpaces[0]);
    adjacent[0].tile = {tileType: TileType.CITY, card: card.name};
    adjacent[0].player = player;
    expect(card.getVictoryPoints(player)).to.eq(1);
    expect(action.availableSpaces[0].adjacency?.bonus).eq(undefined);
  });
});
