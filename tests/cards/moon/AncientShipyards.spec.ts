import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {churnAction} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {AncientShipyards} from '../../../src/server/cards/moon/AncientShipyards';

describe('AncientShipyards', () => {
  let player: TestPlayer;
  let player2: TestPlayer;
  let player3: TestPlayer;
  let card: AncientShipyards;

  beforeEach(() => {
    [/* game */, player, player2, player3] = testGame(3, {moonExpansion: true});
    card = new AncientShipyards();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.stock.titanium = 2;
    player.stock.megacredits = card.cost;
    expect(player.getPlayableCardsForTest()).does.not.include(card);
    player.stock.titanium = 3;
    expect(player.getPlayableCardsForTest()).does.include(card);
  });

  it('play', () => {
    player.stock.titanium = 3;
    expect(player.production.steel).eq(0);

    card.play(player);

    expect(player.stock.titanium).eq(0);
  });

  it('act', () => {
    expect(card.resourceCount).eq(0);
    player.stock.megacredits = 0;
    player2.stock.megacredits = 10;
    player3.stock.megacredits = 7;

    expect(churnAction(card, player)).is.undefined;

    expect(player.stock.megacredits).eq(4);
    expect(player2.stock.megacredits).eq(8);
    expect(player3.stock.megacredits).eq(5);
    expect(card.resourceCount).eq(1);
  });

  it('act solo', () => {
    [/* game */, player] = testGame(1, {moonExpansion: true});

    expect(card.resourceCount).eq(0);
    player.stock.megacredits = 10;

    expect(churnAction(card, player)).is.undefined;

    expect(player.stock.megacredits).eq(12);
    expect(card.resourceCount).eq(1);
  });

  it('victory points', () => {
    expect(card.getVictoryPoints(player)).eq(0);
    card.resourceCount = 1;
    expect(card.getVictoryPoints(player)).eq(-1);
    card.resourceCount = 2;
    expect(card.getVictoryPoints(player)).eq(-2);
    card.resourceCount = 3;
    expect(card.getVictoryPoints(player)).eq(-3);
  });
});

