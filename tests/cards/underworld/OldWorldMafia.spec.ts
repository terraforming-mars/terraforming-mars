import {expect} from 'chai';
import {OldWorldMafia} from '../../../src/server/cards/underworld/OldWorldMafia';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';

describe('OldWorldMafia', () => {
  it('play', () => {
    const card = new OldWorldMafia();
    const [game, player] = testGame(1);

    player.underworldData.corruption = 0;

    player.tagsForTest = {earth: 0},
    cast(card.play(player), undefined);
    runAllActions(game);

    expect(player.underworldData.corruption).to.eq(0);

    player.underworldData.corruption = 0;
    player.tagsForTest = {earth: 1},
    cast(card.play(player), undefined);
    runAllActions(game);

    expect(player.underworldData.corruption).to.eq(1);

    player.underworldData.corruption = 0;
    player.tagsForTest = {earth: 2},
    cast(card.play(player), undefined);
    runAllActions(game);

    expect(player.underworldData.corruption).to.eq(1);

    player.underworldData.corruption = 0;
    player.tagsForTest = {earth: 3},
    cast(card.play(player), undefined);
    runAllActions(game);

    expect(player.underworldData.corruption).to.eq(2);

    player.underworldData.corruption = 0;
    player.tagsForTest = {earth: 4},
    cast(card.play(player), undefined);
    runAllActions(game);

    expect(player.underworldData.corruption).to.eq(2);

    player.underworldData.corruption = 0;
    player.tagsForTest = {earth: 5},
    cast(card.play(player), undefined);
    runAllActions(game);

    expect(player.underworldData.corruption).to.eq(3);
  });
});
