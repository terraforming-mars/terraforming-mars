import {expect} from 'chai';
import {Algae} from '../../../src/cards/base/Algae';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TileType} from '../../../src/TileType';
import {TestPlayers} from '../../TestingUtils';

describe('Algae', function() {
  let card : Algae; let player : Player; let game : Game;

  beforeEach(function() {
    card = new Algae();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Should play', function() {
    const oceanSpaces = game.board.getAvailableSpacesForOcean(player);
    for (let i = 0; i < 5; i++) {
      oceanSpaces[i].tile = {tileType: TileType.OCEAN};
    }

    expect(card.canPlay(player, game)).is.true;

    card.play(player);
    expect(player.plants).to.eq(1);
    expect(player.getProduction(Resources.PLANTS)).to.eq(2);
  });
});
