import {expect} from 'chai';
import {runAllActions} from '../../TestingUtils';
import {VenusianInsects} from '../../../src/server/cards/venusNext/VenusianInsects';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('VenusianInsects', () => {
  let card: VenusianInsects;
  let player: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new VenusianInsects();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
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

    const action = card.play(player);
    expect(action).is.undefined;
  });

  it('Gives victory points', () => {
    player.addResourceTo(card, 7);
    expect(card.getVictoryPoints()).to.eq(3);
  });

  it('Should act', () => {
    player.playedCards.push(card);
    card.action(player);
    runAllActions(game);
    expect(card.resourceCount).to.eq(1);
  });
});
