import {expect} from 'chai';
import {Terra} from '../../../src/server/cards/community/Terra';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {runAllActions, setTemperature} from '../../TestingUtils';
import {testGame} from '../../TestGame';
import {Tag} from '../../../src/common/cards/Tag';
import {Phase} from '../../../src/common/Phase';

describe('Terra', () => {
  let terra: Terra;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    terra = new Terra();
    [game, player, player2] = testGame(2, {coloniesExtension: true});
    game.colonies.push(terra);
  });

  it('Build colony - draws an Earth card', () => {
    expect(player.cardsInHand).is.empty;
    terra.addColony(player);
    expect(player.cardsInHand).has.length(1);
    expect(player.cardsInHand[0].tags).to.include(Tag.EARTH);
  });

  it('Trade at low track position raises temperature', () => {
    terra.trackPosition = 1;
    const startTemp = game.getTemperature();
    const startTr = player.terraformRating;

    terra.trade(player);
    runAllActions(game);

    expect(game.getTemperature()).eq(startTemp + 2);
    // Player does not get TR for the WGT-style increase.
    expect(player.terraformRating).eq(startTr);
    // Phase is restored after WGT bonus.
    expect(game.phase).eq(Phase.RESEARCH);
  });

  it('Trade at middle track position raises oxygen', () => {
    terra.trackPosition = 3;
    const startOxygen = game.getOxygenLevel();
    const startTr = player.terraformRating;

    terra.trade(player);
    runAllActions(game);

    expect(game.getOxygenLevel()).eq(startOxygen + 1);
    expect(player.terraformRating).eq(startTr);
    expect(game.phase).eq(Phase.RESEARCH);
  });

  it('Trade does nothing when the indicated parameter is at its maximum', () => {
    setTemperature(game, 8); // MAX_TEMPERATURE
    terra.trackPosition = 1;
    const startOxygen = game.getOxygenLevel();
    const startTr = player.terraformRating;

    terra.trade(player);
    runAllActions(game);

    // Temperature was maxed out, no other parameter is changed at this position.
    expect(game.getTemperature()).eq(8);
    expect(game.getOxygenLevel()).eq(startOxygen);
    expect(player.terraformRating).eq(startTr);
  });

  for (const run of [
    {tags: {[Tag.EARTH]: 0}, opponentTags: {[Tag.EARTH]: 0}, expected: 0},
    {tags: {[Tag.EARTH]: 2}, opponentTags: {[Tag.EARTH]: 0}, expected: 0},
    {tags: {[Tag.EARTH]: 3}, opponentTags: {[Tag.EARTH]: 0}, expected: 1},
    {tags: {[Tag.EARTH]: 5}, opponentTags: {[Tag.EARTH]: 0}, expected: 1},
    {tags: {[Tag.EARTH]: 6}, opponentTags: {[Tag.EARTH]: 0}, expected: 2},

    {tags: {[Tag.EARTH]: 2}, opponentTags: {[Tag.EARTH]: 1}, expected: 1},

    {tags: {[Tag.EARTH]: 2, [Tag.WILD]: 1}, opponentTags: {}, expected: 1},
    {tags: {[Tag.EARTH]: 2}, opponentTags: {[Tag.WILD]: 1}, expected: 0},
  ] as const) {
    it('Colony bonus ' + JSON.stringify(run), () => {
      player.tagsForTest = run.tags;
      player2.tagsForTest = run.opponentTags;
      terra.giveColonyBonus(player);

      runAllActions(game);

      expect(player.megaCredits).eq(run.expected);
    });
  }
});
