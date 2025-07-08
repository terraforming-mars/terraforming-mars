import {expect} from 'chai';
import {cast, runAllActions} from '../../TestingUtils';
import {DeepFoundations} from '../../../src/server/cards/underworld/DeepFoundations';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {IGame} from '../../../src/server/IGame';
import {assertPlaceCity} from '../../assertions';
import {SelectPayment} from '../../../src/server/inputs/SelectPayment';
import {Payment} from '../../../src/common/inputs/Payment';

describe('DeepFoundations', () => {
  let card: DeepFoundations;
  let game: IGame;
  let player: TestPlayer;

  beforeEach(() => {
    card = new DeepFoundations();
    [game, player] = testGame(1, {underworldExpansion: true});
    player.playedCards.push(card);
  });

  it('can play', () => {
    expect(card.canPlay(player)).is.true;
  });

  for (const run of [
    {mc: 19, steel: 0, expected: false},
    {mc: 20, steel: 0, expected: true},
    {mc: 17, steel: 1, expected: false},
    {mc: 18, steel: 1, expected: true},
    {mc: 15, steel: 2, expected: false},
    {mc: 16, steel: 2, expected: true},
  ] as const) {
    it('can act ' + JSON.stringify(run), () => {
      player.megaCredits = run.mc;
      player.steel = run.steel;
      expect(card.canAct(player)).eq(run.expected);
    });
  }

  it('action', () => {
    player.megaCredits = 22;
    cast(card.action(player), undefined);
    runAllActions(game);
    for (const space of game.board.spaces) {
      space.undergroundResources = 'card1';
    }
    assertPlaceCity(player, player.popWaitingFor());
    expect(player.megaCredits).eq(2);
    expect(player.cardsInHand).to.have.lengthOf(1);
  });

  it('action, spend steel', () => {
    player.megaCredits = 20;
    player.steel = 3;
    cast(card.action(player), undefined);
    runAllActions(game);
    for (const space of game.board.spaces) {
      space.undergroundResources = 'card1';
    }
    const selectPayment = cast(player.popWaitingFor(), SelectPayment);
    selectPayment.cb(Payment.of({megaCredits: 16, steel: 2}));
    runAllActions(game);

    assertPlaceCity(player, player.popWaitingFor());
    expect(player.megaCredits).eq(4);
    expect(player.steel).eq(1);
    expect(player.cardsInHand).to.have.lengthOf(1);
  });
});
