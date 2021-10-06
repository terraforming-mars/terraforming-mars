import {expect} from 'chai';
import {VenusianInsects} from '../../../src/cards/venusNext/VenusianInsects';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('VenusianInsects', () => {
  let card : VenusianInsects; let player : Player; let game : Game;

  beforeEach(() => {
    card = new VenusianInsects();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Cannot play', () => {
    (game as any).venusScaleLevel = 10;
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Can play', () => {
    (game as any).venusScaleLevel = 12;
    expect(player.canPlayIgnoringCost(card)).is.true;
  });

  it('Should play', () => {
    (game as any).venusScaleLevel = 12;
    expect(player.canPlayIgnoringCost(card)).is.true;
    player.playedCards.push(card);

    const action = card.play();
    expect(action).is.undefined;
  });

  it('Gives victory points', () => {
    player.addResourceTo(card, 7);
    expect(card.getVictoryPoints()).to.eq(3);
  });

  it('Should act', () => {
    player.playedCards.push(card);
    card.action(player);
    expect(card.resourceCount).to.eq(1);
  });
});
