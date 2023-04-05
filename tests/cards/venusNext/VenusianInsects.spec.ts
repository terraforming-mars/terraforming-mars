import {expect} from 'chai';
import {runAllActions, setVenusScaleLevel} from '../../TestingUtils';
import {VenusianInsects} from '../../../src/server/cards/venusNext/VenusianInsects';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('VenusianInsects', () => {
  let card: VenusianInsects;
  let player: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new VenusianInsects();
    [game, player] = testGame(2);
  });

  it('Cannot play', () => {
    setVenusScaleLevel(game, 10);
    expect(player.simpleCanPlay(card)).is.not.true;
  });

  it('Can play', () => {
    setVenusScaleLevel(game, 12);
    expect(player.simpleCanPlay(card)).is.true;
  });

  it('Should play', () => {
    setVenusScaleLevel(game, 12);
    expect(player.simpleCanPlay(card)).is.true;
    player.playedCards.push(card);

    const action = card.play(player);
    expect(action).is.undefined;
  });

  it('Gives victory points', () => {
    player.addResourceTo(card, 7);
    expect(card.getVictoryPoints(player)).to.eq(3);
  });

  it('Should act', () => {
    player.playedCards.push(card);
    card.action(player);
    runAllActions(game);
    expect(card.resourceCount).to.eq(1);
  });
});
