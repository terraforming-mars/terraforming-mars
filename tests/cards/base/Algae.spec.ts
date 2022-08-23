import {expect} from 'chai';
import {Algae} from '../../../src/server/cards/base/Algae';
import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {TileType} from '../../../src/common/TileType';
import {TestPlayer} from '../../TestPlayer';

describe('Algae', function() {
  let card: Algae;
  let player: Player;
  let game: Game;

  beforeEach(function() {
    card = new Algae();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    const oceanSpaces = game.board.getAvailableSpacesForOcean(player);
    for (let i = 0; i < 5; i++) {
      oceanSpaces[i].tile = {tileType: TileType.OCEAN};
    }

    expect(player.canPlayIgnoringCost(card)).is.true;

    card.play(player);
    expect(player.plants).to.eq(1);
    expect(player.production.plants).to.eq(2);
  });
});
