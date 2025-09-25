import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {forceGenerationEnd} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {IGame} from '../../../src/server/IGame';
import {Duncan} from '../../../src/server/cards/ceos/Duncan';

describe('Duncan', () => {
  let card: Duncan;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new Duncan();
    [game, player] = testGame(2, {ceoExtension: true, moonExpansion: true});
    player.playedCards.push(card);
  });

  it('Can only act once per game', () => {
    card.action(player);
    forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });

  it('Has 5 VP and 4 MC in gen 1', () => {
    card.action(player);
    expect(player.getVictoryPoints().total).eq(26);
    expect(player.megaCredits).eq(4);
  });

  it('Has -2 VP and 32 MC in gen 8', () => {
    for (let i = 0; i < 7; i++) {
      forceGenerationEnd(player.game);
    }

    player.megaCredits = 0;
    card.action(player);
    expect(player.getVictoryPoints().total).eq(19);
    expect(player.megaCredits).eq(32);

    // Run for a few more generations, leader VP should not change
    forceGenerationEnd(player.game);
    forceGenerationEnd(player.game);
    expect(player.getVictoryPoints().total).eq(19);
  });

  it('Does not affect VP if OPG action not used yet', () => {
    expect(player.getVictoryPoints().total).eq(20);
  });
});
