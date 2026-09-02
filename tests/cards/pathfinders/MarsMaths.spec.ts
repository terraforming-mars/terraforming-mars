import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {MarsMaths} from '../../../src/server/cards/pathfinders/MarsMaths';
import {finishGeneration, runAllActions} from '../../TestingUtils';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {SelectStandardProjectToPlay} from '../../../src/server/inputs/SelectStandardProjectToPlay';
import {LunarBeam} from '../../../src/server/cards/base/LunarBeam';
import {Insulation} from '../../../src/server/cards/base/Insulation';
import {IoMiningIndustries} from '../../../src/server/cards/base/IoMiningIndustries';
import {cast} from '../../../src/common/utils/utils';
import {CardName} from '../../../src/common/cards/CardName';
import {Phase} from '../../../src/common/Phase';
import {Game} from '../../../src/server/Game';
import {assertSelectStandardProject} from '../../assertions';

// Drives a full, real action through `takeAction()`: pops the top-level actions menu,
// picks the standard project out of it, and lets the resulting callback advance
// `actionsTakenThisRound` (and the turn, if the round is over) exactly like the server does.
function takeStandardProjectAction(player: TestPlayer, standardProject: CardName) {
  player.takeAction();
  const [waitingFor, cb] = player.popWaitingFor2();
  const orOptions = cast(waitingFor, OrOptions);
  const standardProjectOption = cast(
    orOptions.options.find((option) => option instanceof SelectStandardProjectToPlay),
    SelectStandardProjectToPlay);
  assertSelectStandardProject(standardProjectOption, player, standardProject);
  cb?.();
}

describe('MarsMaths', () => {
  let card: MarsMaths;

  beforeEach(() => {
    card = new MarsMaths();
  });

  it('On Action', () => {
    const [/* game */, player] = testGame(1);
    const previousActions = player.availableActionsThisRound;
    card.action(player);
    expect(player.availableActionsThisRound).eq(previousActions + 2);
  });

  it('play - solo', () => {
    const [game, player] = testGame(1, {
      pathfindersExpansion: true,
      turmoilExtension: false,
    });
    player.playedCards.push(card);
    game.generation = 10;

    // End the generation. Player will draw 5 cards
    finishGeneration(game);
    expect(game.getGeneration()).to.eq(11);
    const selectCard = cast(player.popWaitingFor(), SelectCard);
    expect(selectCard.cards).has.length(5);
  });

  it('play - 2 player - draft', () => {
    const [game, player, player2] = testGame(2, {
      pathfindersExpansion: true,
      draftVariant: true,
      turmoilExtension: false,
    });
    player.playedCards.push(card);
    game.generation = 10;

    // End the generation. Player will draw 5 cards
    finishGeneration(game);
    expect(game.getGeneration()).to.eq(11);

    const selectCard = cast(player.popWaitingFor(), SelectCard);
    expect(selectCard.cards).has.length(5);
    expect(selectCard.config.min).eq(2);
    expect(selectCard.config.max).eq(2);

    const selectCard2 = cast(player2.popWaitingFor(), SelectCard);
    expect(selectCard2.cards).has.length(4);

    selectCard.cb([selectCard.cards[0], selectCard.cards[1]]);
    selectCard2.cb([selectCard2.cards[0]]);

    runAllActions(game);

    const selectCardb = cast(player.popWaitingFor(), SelectCard);
    expect(selectCardb.cards).has.length(3);
    expect(selectCardb.config.min).eq(1);
    expect(selectCardb.config.max).eq(1);

    const selectCardb2 = cast(player2.popWaitingFor(), SelectCard);
    expect(selectCardb2.cards).has.length(3);
  });

  it('play - 2 player - no draft', () => {
    const [game, player, player2] = testGame(2, {
      pathfindersExpansion: true,
      draftVariant: false,
      turmoilExtension: false,
    });
    player.playedCards.push(card);
    game.generation = 10;

    // End the generation. Player will draw 5 cards
    finishGeneration(game);
    expect(game.getGeneration()).to.eq(11);

    const selectCard = cast(player.popWaitingFor(), SelectCard);
    expect(selectCard.cards).has.length(5);
    expect(selectCard.config.min).eq(0);
    expect(selectCard.config.max).eq(4);
    const selectCard2 = cast(player2.popWaitingFor(), SelectCard);
    expect(selectCard2.cards).has.length(4);
  });

  it('does not reduce research selection when fewer than five cards were drawn', () => {
    const [game, player] = testGame(1, {skipInitialCardSelection: true, skipInitialShuffling: true});
    game.generation = 2;
    // Enough to afford all 3 drawn cards, so only the Mars Maths cap is under test.
    player.megaCredits = 20;
    player.playedCards.push(new MarsMaths());
    game.projectDeck.drawPile = [new LunarBeam(), new Insulation(), new IoMiningIndustries()];
    game.projectDeck.discardPile = [];

    game.gotoResearchPhase();

    const selectCard = cast(player.popWaitingFor(), SelectCard);

    expect(selectCard.cards).has.length(3);
    expect(selectCard.config.max).eq(3);
  });

  // This test case is just here in comparison to the action test. It's a
  // baseline to show that without the card action, the player is limited to
  // two actions per turn.
  it('Does not take action, limited to two actions', () => {
    const [game, player, player2] = testGame(2);
    player.playedCards.push(card);
    player.megaCredits = 100;
    game.generation = 2;
    game.phase = Phase.ACTION;

    expect(game.activePlayer.id).eq(player.id);

    takeStandardProjectAction(player, CardName.POWER_PLANT_STANDARD_PROJECT);

    expect(game.activePlayer.id).eq(player.id);

    takeStandardProjectAction(player, CardName.POWER_PLANT_STANDARD_PROJECT);

    expect(game.activePlayer.id).eq(player2.id);
  });

  it('action', () => {
    const [game, player, player2] = testGame(2);
    player.playedCards.push(card);
    player.megaCredits = 100;
    game.generation = 2;
    game.phase = Phase.ACTION;

    expect(game.activePlayer.id).eq(player.id);

    takeStandardProjectAction(player, CardName.POWER_PLANT_STANDARD_PROJECT);

    expect(game.activePlayer.id).eq(player.id);

    card.action(player);

    takeStandardProjectAction(player, CardName.POWER_PLANT_STANDARD_PROJECT);

    expect(game.activePlayer.id).eq(player.id);

    takeStandardProjectAction(player, CardName.POWER_PLANT_STANDARD_PROJECT);

    expect(game.activePlayer.id).eq(player.id);

    takeStandardProjectAction(player, CardName.POWER_PLANT_STANDARD_PROJECT);

    expect(game.activePlayer.id).eq(player2.id);
  });

  it('Undo after Mars Maths action, still that player\'s turn', () => {
    const [game, player /* , player2 */] = testGame(2);
    player.playedCards.push(card);
    player.megaCredits = 100;
    game.generation = 2;
    game.phase = Phase.ACTION;

    expect(game.activePlayer.id).eq(player.id);

    takeStandardProjectAction(player, CardName.POWER_PLANT_STANDARD_PROJECT);

    card.action(player);
    takeStandardProjectAction(player, CardName.POWER_PLANT_STANDARD_PROJECT);

    expect(player.actionsTakenThisRound).eq(2);
    expect(player.availableActionsThisRound).eq(4);
    expect(player.megaCredits).eq(78);
    expect(player.production.energy).eq(2);

    const serialized = game.serialize();

    // Third action: another power plant standard project, to be undone below.
    takeStandardProjectAction(player, CardName.POWER_PLANT_STANDARD_PROJECT);

    expect(player.production.energy).eq(3);
    expect(player.megaCredits).eq(67);
    expect(player.actionsTakenThisRound).eq(3);
    expect(game.activePlayer.id).eq(player.id);

    // Clicks "Undo last action": the server discards the in-memory game and reloads
    // the last saved snapshot, re-prompting the active player for their next action
    // (this is exactly what `Game.deserialize` does when the phase is ACTION).
    const restoredGame = Game.deserialize(serialized);
    const restoredPlayer = restoredGame.getPlayerById(player.id);

    // The third standard project's energy bump is rolled back along with everything
    // else after the snapshot.
    expect(restoredPlayer.actionsTakenThisRound).eq(2);
    expect(restoredPlayer.availableActionsThisRound).eq(4);
    expect(restoredPlayer.megaCredits).eq(78);
    expect(restoredPlayer.production.energy).eq(2);

    // It's still this player's turn. The restored actionsTakenThisRound (2) happens to
    // match the *default* budget of 2, but that must not cause the server to think the
    // turn is over and hand it off to player2.
    expect(restoredGame.activePlayer.id).eq(player.id);
  });
});
