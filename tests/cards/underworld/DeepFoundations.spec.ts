import {expect} from 'chai';
import {cast, runAllActions} from '../../TestingUtils';
import {DeepFoundations} from '../../../src/server/cards/underworld/DeepFoundations';
import {testGame} from '../../TestGame';
import {assertPlaceCity} from '../../assertions';
import {SelectPayment} from '../../../src/server/inputs/SelectPayment';
import {Payment} from '../../../src/common/inputs/Payment';
import {TileType} from '../../../src/common/TileType';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';

describe('DeepFoundations', () => {
  it('can play', () => {
    const card = new DeepFoundations();
    const [/* game */, player] = testGame(1, {underworldExpansion: true});
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
      const card = new DeepFoundations();
      const [/* game */, player] = testGame(1, {underworldExpansion: true});
      player.playedCards.push(card);

      player.megaCredits = run.mc;
      player.steel = run.steel;
      expect(card.canAct(player)).eq(run.expected);
    });
  }

  it('action', () => {
    const card = new DeepFoundations();
    const [game, player] = testGame(1, {underworldExpansion: true});
    player.playedCards.push(card);

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
    const card = new DeepFoundations();
    const [game, player] = testGame(1, {underworldExpansion: true});
    player.playedCards.push(card);

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

  it('Will not excavate on a spacce with a tile', () => {
    const card = new DeepFoundations();
    const [game, player] = testGame(1, {underworldExpansion: true, aresExtension: true});
    player.playedCards.push(card);

    player.megaCredits = 20 + 8; // 22 for the action, 8 for the dust storm
    expect(player.underworldData.tokens).has.lengthOf(0);

    cast(card.action(player), undefined);
    runAllActions(game);
    const selectSpace = cast(player.popWaitingFor(), SelectSpace);
    const spaces = selectSpace.spaces;
    const hazardSpace = spaces.find((s) => s.tile?.tileType === TileType.DUST_STORM_MILD)!;

    selectSpace.cb(hazardSpace);

    expect(hazardSpace.excavator).to.be.undefined;
    expect(player.underworldData.tokens).has.lengthOf(0);
    expect(hazardSpace.tile?.tileType).to.eq(TileType.CITY);
  });
});
