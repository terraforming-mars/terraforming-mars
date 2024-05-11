import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {cast, forceGenerationEnd, runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {Ender} from '../../../src/server/cards/ceos/Ender';
import {MicroMills} from '../../../src/server/cards/base/MicroMills';
import {Research} from '../../../src/server/cards/base/Research';
import {testGame} from '../../TestGame';
import {SelectCard} from '../../../src/server/inputs/SelectCard';

describe('Ender', function() {
  let card: Ender;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new Ender();
    [game, player] = testGame(2);
  });

  it('Cannot act without cards', function() {
    expect(card.canAct(player)).is.false;
  });

  it('Takes action', function() {
    const initialCards = [new Research(), new MicroMills()];

    player.cardsInHand.push(...initialCards);
    expect(card.canAct(player)).is.true;

    cast(card.action(player), undefined);
    runAllActions(game);
    const selectCard = cast(player.popWaitingFor(), SelectCard);
    selectCard.cb(initialCards);
    runAllActions(game);

    expect(game.projectDeck.discardPile).includes(initialCards[0]);
    expect(game.projectDeck.discardPile).includes(initialCards[1]);
    expect(player.cardsInHand).has.length(2);
    expect(player.cardsInHand).does.not.include(initialCards[0]);
    expect(player.cardsInHand).does.not.include(initialCards[1]);
  });

  it('Can only act once per game', function() {
    player.cardsInHand.push(new Research(), new MicroMills());
    expect(card.isDisabled).is.false;
    expect(card.canAct(player)).is.true;

    cast(card.action(player), undefined);

    forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });
});
