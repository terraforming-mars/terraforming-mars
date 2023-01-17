import {expect} from 'chai';
import {CardType} from '../../../src/common/cards/CardType';
import {IProjectCard} from '../../../src/server/cards/IProjectCard';
import {Karen} from '../../../src/server/cards/leaders/Karen';
import {GalileanMining} from '../../../src/server/cards/prelude/GalileanMining';
import {Game} from '../../../src/server/Game';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {cast, forceGenerationEnd, runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('Karen', function() {
  let card: Karen;
  let player: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new Karen();
    game = newTestGame(2, {preludeExtension: true});
    player = getTestPlayer(game, 0);

    // This ensures that preludes which cost MC are affordable.
    player.megaCredits = 20;
  });

  it('Can act', function() {
    expect(card.canAct()).is.true;
  });

  it('Takes action', function() {
    const selectCard = cast(card.action(player), SelectCard<IProjectCard>);
    expect(selectCard.cards).has.length(1);

    selectCard.cb([selectCard.cards[0]]);
    expect(player.playedCards.filter((card) => card.cardType === CardType.PRELUDE)).has.length(1);
  });

  it('Takes action in Generation 4', function() {
    for (let i = 0; i < 3; i++) {
      runAllActions(game);
      forceGenerationEnd(game);
    }

    const selectCard = cast(card.action(player), SelectCard<IProjectCard>);
    expect(selectCard.cards).has.length(4);

    selectCard.cb([selectCard.cards[0]]);
    expect(player.playedCards.filter((card) => card.cardType === CardType.PRELUDE)).has.length(1);
  });

  it('Discards unplayable prelude cards', function() {
    player.megaCredits = 0;
    game.preludeDeck.drawPile.push(new GalileanMining());

    const action = card.action(player);
    expect(action).is.undefined;
    expect(player.playedCards.filter((card) => card.cardType === CardType.PRELUDE)).has.length(0);
  });

  it('Can only act once per game', function() {
    const selectCard = cast(card.action(player), SelectCard<IProjectCard>);
    selectCard.cb([selectCard.cards[0]]);
    forceGenerationEnd(game);

    expect(card.isDisabled).is.true;
    expect(card.canAct()).is.false;
  });
});
