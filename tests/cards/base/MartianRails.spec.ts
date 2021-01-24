import {expect} from 'chai';
import {MartianRails} from '../../../src/cards/base/MartianRails';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestingUtils';

describe('MartianRails', function() {
  let card : MartianRails; let player : Player; let game : Game;

  beforeEach(function() {
    card = new MartianRails();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t act without energy', function() {
    expect(card.play(player)).is.undefined;
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act', function() {
    player.energy = 1;
    expect(card.canAct(player)).is.true;
    game.addCityTile(player, game.board.getAvailableSpacesOnLand(player)[0].id);

    card.action(player);
    expect(player.energy).to.eq(0);
    expect(player.megaCredits).to.eq(1);
  });
});
