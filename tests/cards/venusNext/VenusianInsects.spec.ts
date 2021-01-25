import {expect} from 'chai';
import {VenusianInsects} from '../../../src/cards/venusNext/VenusianInsects';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestingUtils';

describe('VenusianInsects', function() {
  let card : VenusianInsects; let player : Player; let game : Game;

  beforeEach(function() {
    card = new VenusianInsects();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    (game as any).venusScaleLevel = 10;
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    (game as any).venusScaleLevel = 12;
    expect(card.canPlay(player)).is.true;
    player.playedCards.push(card);

    const action = card.play();
    expect(action).is.undefined;
  });

  it('Gives victory points', function() {
    player.addResourceTo(card, 7);
    expect(card.getVictoryPoints()).to.eq(3);
  });

  it('Should act', function() {
    player.playedCards.push(card);
    card.action(player);
    expect(card.resourceCount).to.eq(1);
  });
});
