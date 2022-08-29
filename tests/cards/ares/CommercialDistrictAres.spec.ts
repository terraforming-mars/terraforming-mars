import {expect} from 'chai';
import {Player} from '../../../src/server/Player';
import {Game} from '../../../src/server/Game';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {Resources} from '../../../src/common/Resources';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {CommercialDistrictAres} from '../../../src/server/cards/ares/CommercialDistrictAres';
import {ARES_OPTIONS_NO_HAZARDS} from '../../ares/AresTestHelper';
import {TestPlayer} from '../../TestPlayer';
import {cast} from '../../TestingUtils';

describe('CommercialDistrictAres', function() {
  let card: CommercialDistrictAres;
  let player: Player;

  beforeEach(function() {
    card = new CommercialDistrictAres();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player, ARES_OPTIONS_NO_HAZARDS);
  });

  it('Should play', function() {
    expect(card.canPlay(player)).is.false;
    player.production.add(Resources.ENERGY, 1);
    expect(card.canPlay(player)).is.true;

    const action = cast(card.play(player), SelectSpace);
    action.cb(action.availableSpaces[0]);

    expect(action.availableSpaces[0].adjacency).to.deep.eq({bonus: [SpaceBonus.MEGACREDITS, SpaceBonus.MEGACREDITS]});
  });
});
