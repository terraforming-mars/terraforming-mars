import {expect} from 'chai';
import {AdvancedPowerGrid} from '../../../src/cards/pathfinders/AdvancedPowerGrid';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {TestPlayers} from '../../TestPlayers';
import {Units} from '../../../src/common/Units';

describe('AdvancedPowerGrid', function() {
  let card: AdvancedPowerGrid;
  let player: TestPlayer;

  beforeEach(function() {
    card = new AdvancedPowerGrid();
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player);
  });

  it('play', function() {
    player.setProductionForTest(Units.EMPTY);
    card.play(player);
    expect(player.getProductionForTest()).deep.eq(Units.of({energy: 2, megacredits: 1}));

    player.setProductionForTest(Units.EMPTY);
    player.tagsForTest = {power: 1};
    card.play(player);
    expect(player.getProductionForTest()).deep.eq(Units.of({energy: 2, megacredits: 2}));

    player.setProductionForTest(Units.EMPTY);
    player.tagsForTest = {power: 4};
    card.play(player);
    expect(player.getProductionForTest()).deep.eq(Units.of({energy: 2, megacredits: 5}));
  });
});
