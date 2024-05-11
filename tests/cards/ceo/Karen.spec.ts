import {expect} from 'chai';
import {CardType} from '../../../src/common/cards/CardType';
import {IPreludeCard} from '../../../src/server/cards/prelude/IPreludeCard';
import {Karen} from '../../../src/server/cards/ceos/Karen';
import {GalileanMining} from '../../../src/server/cards/prelude/GalileanMining';
import {IGame} from '../../../src/server/IGame';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {cast, forceGenerationEnd, runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('Karen', function() {
  let card: Karen;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new Karen();
    [game, player] = testGame(2, {preludeExtension: true});

    // This ensures that preludes which cost MC are affordable.
    player.megaCredits = 20;
  });

  it('Can act', function() {
    expect(card.canAct(player)).is.true;
  });

  it('Takes action', function() {
    const selectCard = cast(card.action(player), SelectCard<IPreludeCard>);
    expect(selectCard.cards).has.length(1);

    selectCard.cb([selectCard.cards[0]]);
    expect(player.playedCards.filter((card) => card.type === CardType.PRELUDE)).has.length(1);
  });

  it('Takes action in Generation 4', function() {
    for (let i = 0; i < 3; i++) {
      runAllActions(game);
      forceGenerationEnd(game);
    }

    const selectCard = cast(card.action(player), SelectCard<IPreludeCard>);
    expect(selectCard.cards).has.length(4);

    selectCard.cb([selectCard.cards[0]]);
    expect(player.playedCards.filter((card) => card.type === CardType.PRELUDE)).has.length(1);
  });

  it('Discards unplayable prelude cards', function() {
    player.megaCredits = 0;
    game.preludeDeck.drawPile.push(new GalileanMining());

    cast(card.action(player), SelectCard<IPreludeCard>);
    expect(player.playedCards.filter((card) => card.type === CardType.PRELUDE)).has.length(0);
  });

  it('Can only act once per game', function() {
    const selectCard = cast(card.action(player), SelectCard<IPreludeCard>);
    selectCard.cb([selectCard.cards[0]]);
    forceGenerationEnd(game);

    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });
});
