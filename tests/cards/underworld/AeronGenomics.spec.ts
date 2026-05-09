import {expect} from 'chai';
import {AeronGenomics} from '../../../src/server/cards/underworld/AeronGenomics';
import {Birds} from '../../../src/server/cards/base/Birds';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {IGame} from '../../../src/server/IGame';
import {runAllActions, setOxygenLevel} from '../../TestingUtils';
import {SelectProjectCardToPlay} from '../../../src/server/inputs/SelectProjectCardToPlay';
import {Payment} from '../../../src/common/inputs/Payment';
import {AndOptions} from '../../../src/server/inputs/AndOptions';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {SelectClaimedUndergroundToken} from '../../../src/server/inputs/SelectClaimedUndergroundToken';
import {cast} from '../../../src/common/utils/utils';

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

  it('action - discard 2 underground  tokens, add 2 animals to selected card', () => {
    const birds = new Birds();
    player.playedCards.push(card, birds);
    player.underworldData.tokens.push(
      {token: 'nothing', shelter: false, active: false},
      {token: 'nothing', shelter: false, active: false},
    );

    const andOptions = cast(card.action(player), AndOptions);
    const selectCard = cast(andOptions.options[0], SelectCard);
    const selectTokens = cast(andOptions.options[1], SelectClaimedUndergroundToken);

    selectCard.cb([birds]);
    selectTokens.cb([0, 1]);
    andOptions.cb(undefined);

    expect(birds.resourceCount).eq(2);
    expect(player.underworldData.tokens).has.length(0);
  });

  it('action - discard 1 underworld token, add 1 animal to selected card', () => {
    const birds = new Birds();
    player.playedCards.push(card, birds);
    player.underworldData.tokens.push(
      {token: 'nothing', shelter: false, active: false},
      {token: 'nothing', shelter: false, active: false},
    );

    const andOptions = cast(card.action(player), AndOptions);
    const selectCard = cast(andOptions.options[0], SelectCard);
    const selectTokens = cast(andOptions.options[1], SelectClaimedUndergroundToken);

    selectCard.cb([birds]);
    selectTokens.cb([0]);
    andOptions.cb(undefined);

    expect(birds.resourceCount).eq(1);
    expect(player.underworldData.tokens).has.length(1);
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
      payment: Payment.of({megacredits: birds.cost}),
    });
    expect(card.resourceCount).eq(1);
  });
});
