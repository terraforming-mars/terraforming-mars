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
    player.titanium = 2;
    player.megaCredits = card.cost;
    expect(player.getPlayableCardsForTest()).does.not.include(card);
    player.titanium = 3;
    expect(player.getPlayableCardsForTest()).does.include(card);
  });

  it('play', () => {
    player.titanium = 3;
    expect(player.production.steel).eq(0);

    card.play(player);

    expect(player.titanium).eq(0);
  });

  it('act', () => {
    expect(card.resourceCount).eq(0);
    player.megaCredits = 0;
    player2.megaCredits = 10;
    player3.megaCredits = 7;

    expect(churnAction(card, player)).is.undefined;

    expect(player.megaCredits).eq(4);
    expect(player2.megaCredits).eq(8);
    expect(player3.megaCredits).eq(5);
    expect(card.resourceCount).eq(1);
  });

  it('act solo', () => {
    [/* game */, player] = testGame(1, {moonExpansion: true});

    expect(card.resourceCount).eq(0);
    player.megaCredits = 10;

    expect(churnAction(card, player)).is.undefined;

    expect(player.megaCredits).eq(12);
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

