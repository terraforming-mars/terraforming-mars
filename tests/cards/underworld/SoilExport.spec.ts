import {expect} from 'chai';
import {SoilExport} from '../../../src/server/cards/underworld/SoilExport';
import {testGame} from '../../TestGame';
import {cast, forceGenerationEnd, runAllActions} from '../../TestingUtils';
import {assertIsExcavationAction} from '../../underworld/underworldAssertions';

describe('SoilExport', () => {
  it('Should play', () => {
    const card = new SoilExport();
    const [game, player] = testGame(2, {underworldExpansion: true});

    expect(game.generation).eq(1);
    forceGenerationEnd(game);
    expect(game.generation).eq(2);
    expect(player.megaCredits).eq(20);

    cast(card.play(player), undefined);
    runAllActions(game);

    assertIsExcavationAction(player, player.popWaitingFor());

    player.playedCards.push(card);

    player.megaCredits = 0;
    forceGenerationEnd(game);
    expect(game.generation).eq(3);
    expect(player.megaCredits).eq(32); // TR = 20

    player.megaCredits = 0;
    forceGenerationEnd(game);
    expect(game.generation).eq(4);
    expect(player.megaCredits).eq(20);
  });
});
