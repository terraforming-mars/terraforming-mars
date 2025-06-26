import {expect} from 'chai';
import {AdvancedPowerGrid} from '../../../src/server/cards/pathfinders/AdvancedPowerGrid';
import {TestPlayer} from '../../TestPlayer';
import {Units} from '../../../src/common/Units';
import {testGame} from '../../TestingUtils';

describe('AdvancedPowerGrid', () => {
  let card: AdvancedPowerGrid;
  let player: TestPlayer;

  beforeEach(() => {
    card = new AdvancedPowerGrid();
    [/* game */, player] = testGame(1);
  });

  it('play', () => {
    player.production.override(Units.EMPTY);
    card.play(player);
    expect(player.production.asUnits()).deep.eq(Units.of({energy: 2, megacredits: 1}));

    player.production.override(Units.EMPTY);
    player.tagsForTest = {power: 1};
    card.play(player);
    expect(player.production.asUnits()).deep.eq(Units.of({energy: 2, megacredits: 2}));

    player.production.override(Units.EMPTY);
    player.tagsForTest = {power: 4};
    card.play(player);
    expect(player.production.asUnits()).deep.eq(Units.of({energy: 2, megacredits: 5}));
  });
});
