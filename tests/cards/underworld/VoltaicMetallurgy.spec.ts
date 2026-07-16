import {expect} from 'chai';
import {VoltaicMetallurgy} from '../../../src/server/cards/underworld/VoltaicMetallurgy';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';
import {SelectAmount} from '../../../src/server/inputs/SelectAmount';

describe('VoltaicMetallurgy', () => {
  it('canPlay', () => {
    const card = new VoltaicMetallurgy();
    const [/* game */, player] = testGame(1);

    expect(card.canPlay(player)).is.false;
    player.tagsForTest = {science: 1};
    expect(card.canPlay(player)).is.true;
  });

  it('play', () => {
    const card = new VoltaicMetallurgy();
    const [/* game */, player] = testGame(1);

    cast(card.play(player), undefined);
  });

  const canActRuns = [
    {steel: 0, powerTags: 0, canPlay: false},
    {steel: 1, powerTags: 0, canPlay: false},
    {steel: 0, powerTags: 1, canPlay: false},
    {steel: 1, powerTags: 1, canPlay: true},
  ] as const;
  for (const run of canActRuns) {
    it('canAct ' + JSON.stringify(run), () => {
      const card = new VoltaicMetallurgy();
      const [/* game */, player] = testGame(1);

      player.tagsForTest = {power: run.powerTags};
      player.steel = run.steel;
      expect(card.canAct(player)).eq(run.canPlay);
    });
  }

  const actionRuns = [
    {steel: 4, powerTags: 2, amount: 1, expected: {max: 2, steel: 3, titanium: 1}},
    {steel: 4, powerTags: 4, amount: 3, expected: {max: 4, steel: 1, titanium: 3}},
  ] as const;
  for (const run of actionRuns) {
    it('action ' + JSON.stringify(run), () => {
      const card = new VoltaicMetallurgy();
      const [/* game */, player] = testGame(1);

      player.tagsForTest = {power: run.powerTags};
      player.steel = run.steel;
      const selectAmount = cast(card.action(player), SelectAmount);
      expect(selectAmount.max).eq(run.expected.max);
      selectAmount.cb(run.amount);
      expect(player.steel).eq(run.expected.steel);
      expect(player.titanium).eq(run.expected.titanium);
    });
  }
});
