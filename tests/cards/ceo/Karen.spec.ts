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
import {CardName} from '../../../src/common/cards/CardName';

describe('Karen', () => {
  let card: Karen;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new Karen();
    [game, player] = testGame(2, {preludeExtension: true});

    // This ensures that preludes which cost MC are affordable.
    player.megaCredits = 20;
  });

  it('Can act', () => {
    expect(card.canAct(player)).is.true;
  });

  it('Takes action', () => {
    const selectCard = cast(card.action(player), SelectCard<IPreludeCard>);
    expect(selectCard.cards).has.length(1);

    selectCard.cb([selectCard.cards[0]]);
    expect(player.playedCards.filter((card) => card.type === CardType.PRELUDE)).has.length(1);
  });

  it('Takes action in Generation 4', () => {
    for (let i = 0; i < 3; i++) {
      runAllActions(game);
      forceGenerationEnd(game);
    }

    const selectCard = cast(card.action(player), SelectCard<IPreludeCard>);
    expect(selectCard.cards).has.length(4);

    selectCard.cb([selectCard.cards[0]]);
    expect(player.playedCards.filter((card) => card.type === CardType.PRELUDE)).has.length(1);
  });

  it('Unplayable prelude', () => {
    player.megaCredits = 0;
    game.preludeDeck.drawPile.push(new GalileanMining());

    const selectCard = cast(card.action(player), SelectCard<IPreludeCard>);
    const prelude = selectCard.cards[0];
    expect(selectCard.cards).has.length(1);
    expect(prelude.name).eq(CardName.GALILEAN_MINING);
    expect(Array.from(prelude.warnings)).to.have.members(['preludeFizzle']);

    selectCard.cb([prelude]);
    runAllActions(game);

    expect(player.playedCards).has.length(0);
    expect(player.megaCredits).eq(15);
    expect(game.preludeDeck.discardPile).to.have.members([prelude]);
  });

  it('Can only act once per game', () => {
    const selectCard = cast(card.action(player), SelectCard<IPreludeCard>);
    selectCard.cb([selectCard.cards[0]]);
    forceGenerationEnd(game);

    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });
});
