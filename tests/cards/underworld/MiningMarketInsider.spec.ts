import {expect} from 'chai';
import {MiningMarketInsider} from '../../../src/server/cards/underworld/MiningMarketInsider';
import {testGame} from '../../TestGame';
import {UnderworldExpansion} from '../../../src/server/underworld/UnderworldExpansion';
import {IPlayer} from '../../../src/server/IPlayer';

describe('MiningMarketInsider', () => {
  it('effect', () => {
    const card = new MiningMarketInsider();
    const [game, player, player2] = testGame(2, {underworldExpansion: true});

    player.playedCards.push(card);

    function identify(player: IPlayer) {
      UnderworldExpansion.identify(game, UnderworldExpansion.identifiableSpaces(player)[0], player);
    }
    function simulateFinishingAction(player: IPlayer) {
      player.actionsTakenThisGame++;
      player.actionsTakenThisRound++;
    }

    identify(player);
    identify(player);

    simulateFinishingAction(player);
    expect(card.resourceCount).eq(1);

    identify(player2);

    simulateFinishingAction(player);
    expect(card.resourceCount).eq(2);
  });

  it('canAct', () => {
    const card = new MiningMarketInsider();
    const [/* game */, player] = testGame(1, {underworldExpansion: true});

    card.resourceCount = 3;
    expect(card.canAct(player)).is.false;
    card.resourceCount = 4;
    expect(card.canAct(player)).is.true;
  });

  it('action', () => {
    const card = new MiningMarketInsider();
    const [/* game */, player] = testGame(1, {underworldExpansion: true});

    card.resourceCount = 4;
    expect(player.cardsInHand).has.length(0);
    card.action(player);
    expect(card.resourceCount).eq(0);

    expect(player.cardsInHand).has.length(1);
  });
});
