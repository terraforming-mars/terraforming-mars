import {expect} from 'chai';
import {cast, runAllActions} from '../TestingUtils';
import {TestPlayer} from '../TestPlayer';
import {testGame} from '../TestGame';
import {SelectCard} from '../../src/server/inputs/SelectCard';
import {OrOptions} from '../../src/server/inputs/OrOptions';
import {Phase} from '../../src/common/Phase';

describe('underworld drafting', () => {
  it('run research phase, 1p, no draft, player has corruption, declines', () => {
    const [game, player] = testGame(1, {underworldExpansion: true, skipInitialCardSelection: true});
    game.generation = 2;
    game.underworldDraftEnabled = true;
    player.megaCredits = 20;
    player.underworldData.corruption = 1;

    game.gotoResearchPhase();

    assertDoNotDiscard(player, [0, 2]);

    expect(player.megaCredits).eq(14);
    expect(game.phase).eq(Phase.ACTION);
  });

  it('run research phase, 1p, no draft, player has corruption, accepts', () => {
    const [game, player] = testGame(1, {underworldExpansion: true, skipInitialCardSelection: true});
    game.underworldDraftEnabled = true;
    game.generation = 2;
    player.megaCredits = 20;
    player.underworldData.corruption = 1;

    game.gotoResearchPhase();

    const corruption = player.underworldData.corruption;

    const [discarded, kept] = assertDiscardWithCorruption(player, [0, 2]);

    runAllActions(game);

    expect(player.game.projectDeck.discardPile).include.members(discarded);
    expect(player.underworldData.corruption).eq(corruption - 1);

    const selectCard = cast(player.popWaitingFor(), SelectCard);
    const cards = selectCard.cards;

    expect(cards).does.not.include.members(discarded);
    expect(cards).does.include.members(kept);

    selectCard.cb([cards[0], cards[2]]);
    runAllActions(game);

    expect(player.cardsInHand).include.members([cards[0], cards[2]]);
    expect(player.megaCredits).eq(14);

    expect(game.phase).eq(Phase.ACTION);
  });

  it('run research phase, 2p, no draft, players have corruption, decline', () => {
    const [game, player, player2] = testGame(2, {underworldExpansion: true, skipInitialCardSelection: true});
    game.underworldDraftEnabled = true;
    game.generation = 2;
    player.megaCredits = 20;
    player2.megaCredits = 20;
    player.underworldData.corruption = 1;
    player2.underworldData.corruption = 1;

    game.gotoResearchPhase();

    const corruption1 = player.underworldData.corruption;
    const corruption2 = player2.underworldData.corruption;

    assertDoNotDiscard(player, [0, 2]);
    assertDoNotDiscard(player2, [0, 2]);

    expect(player.megaCredits).eq(14);
    expect(player2.megaCredits).eq(14);
    expect(player.underworldData.corruption).eq(corruption1);
    expect(player2.underworldData.corruption).eq(corruption2);
    expect(game.phase).eq(Phase.ACTION);
  });


  function assertDoNotDiscard(player: TestPlayer, chosen: ReadonlyArray<number>) {
    const orOptions = cast(player.popWaitingFor(), OrOptions);
    const selectCard = cast(orOptions.options[0], SelectCard);
    const keeping = chosen.map((i) => selectCard.cards[i]);
    const discarding = selectCard.cards.filter((_, idx) => !chosen.includes(idx));
    const corruption = player.underworldData.corruption;

    selectCard.cb(keeping);
    runAllActions(player.game);

    expect(player.cardsInHand).to.have.members(keeping);
    expect(player.game.projectDeck.discardPile).include.members(discarding);
    expect(player.underworldData.corruption).eq(corruption);
  }

  function assertDiscardWithCorruption(player: TestPlayer, discarded: Array<number>) {
    const orOptions = cast(player.popWaitingFor(), OrOptions);
    const selectCard = cast(orOptions.options[1], SelectCard);
    const discarding = discarded.map((i) => selectCard.cards[i]);
    const keeping = selectCard.cards.filter((_, idx) => !discarded.includes(idx));

    selectCard.cb(discarding);

    return [discarding, keeping];
  }
});
