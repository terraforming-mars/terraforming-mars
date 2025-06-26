import {expect} from 'chai';
import {cast, runAllActions, setVenusScaleLevel} from '../../TestingUtils';
import {VenusianInsects} from '../../../src/server/cards/venusNext/VenusianInsects';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('VenusianInsects', () => {
  let card: VenusianInsects;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new VenusianInsects();
    [game, player] = testGame(2);
  });

  it('Cannot play', () => {
    setVenusScaleLevel(game, 10);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can play', () => {
    setVenusScaleLevel(game, 12);
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', () => {
    setVenusScaleLevel(game, 12);
    expect(card.canPlay(player)).is.true;
    player.playedCards.push(card);

    cast(card.play(player), undefined);
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
