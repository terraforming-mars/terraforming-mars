import {expect} from 'chai';
import {AeronGenomics} from '../../../src/server/cards/underworld/AeronGenomics';
import {Birds} from '../../../src/server/cards/base/Birds';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {IGame} from '../../../src/server/IGame';
import {runAllActions, setOxygenLevel} from '../../TestingUtils';
import {SelectProjectCardToPlay} from '../../../src/server/inputs/SelectProjectCardToPlay';
import {Payment} from '../../../src/common/inputs/Payment';

describe('AeronGenomics', () => {
  let card: AeronGenomics;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new AeronGenomics();
    [game, player] = testGame(2, {underworldExpansion: true});
  });

  it('Play', () => {
    expect(card.resourceCount).eq(0);
    card.play(player);
    runAllActions(game);
    expect(card.resourceCount).eq(2);
    expect(player.steel).eq(5);
  });


  it('canPlay ', () => {
    player.playedCards.push(card);

    expect(card.canAct(player)).is.false;

    player.underworldData.tokens.push({
      token: 'nothing',
      shelter: false,
      active: false,
    });
    expect(card.canAct(player)).is.true;
  });

  // TODO: test action
  it('TODO action', () => {
  });

  it('effect', () => {
    const birds = new Birds(); // Birds requires 13% oxygen
    player.production.plants = 2; // Card requirement
    player.cardsInHand.push(birds);
    player.megaCredits = birds.cost;
    player.playedCards.push(card);

    setOxygenLevel(game, 11);
    card.resourceCount = 3;

    const selectProjectCardToPlay = new SelectProjectCardToPlay(player);
    expect(selectProjectCardToPlay.cards).includes(birds);
    selectProjectCardToPlay.process({
      type: 'projectCard',
      card: birds.name,
      payment: Payment.of({megaCredits: birds.cost}),
    });
    expect(card.resourceCount).eq(1);
  });
});
