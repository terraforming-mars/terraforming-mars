import {expect} from 'chai';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {Resources} from '../../../src/common/Resources';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {CommercialDistrictAres} from '../../../src/cards/ares/CommercialDistrictAres';
import {ARES_OPTIONS_NO_HAZARDS} from '../../ares/AresTestHelper';
import {TestPlayers} from '../../TestPlayers';

describe('CommercialDistrictAres', function() {
  let card : CommercialDistrictAres; let player : Player;

  beforeEach(function() {
    card = new CommercialDistrictAres();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player, ARES_OPTIONS_NO_HAZARDS);
  });

  it('Should play', function() {
    player.addProduction(Resources.ENERGY, 1);
    expect(card.canPlay(player)).is.true;

    const action = card.play(player);
    expect(action instanceof SelectSpace);
    action.cb(action.availableSpaces[0]);

    expect(action.availableSpaces[0].adjacency).to.deep.eq({bonus: [SpaceBonus.MEGACREDITS, SpaceBonus.MEGACREDITS]});
  });
});
