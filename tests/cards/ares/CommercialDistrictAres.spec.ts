import {expect} from 'chai';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {Resources} from '../../../src/Resources';
import {SpaceBonus} from '../../../src/SpaceBonus';
import {CommercialDistrictAres} from '../../../src/cards/ares/CommercialDistrictAres';
import {ARES_OPTIONS_NO_HAZARDS} from '../../ares/AresTestHelper';
import {TestPlayers} from '../../TestingUtils';

describe('CommercialDistrictAres', function() {
  let card : CommercialDistrictAres; let player : Player; let game : Game;

  beforeEach(function() {
    card = new CommercialDistrictAres();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = new Game('foobar', [player, redPlayer], player, ARES_OPTIONS_NO_HAZARDS);
  });

  it('Should play', function() {
    player.addProduction(Resources.ENERGY);
    expect(card.canPlay(player, game)).is.true;

    const action = card.play(player, game);
    expect(action instanceof SelectSpace);
    action.cb(action.availableSpaces[0]);

    expect(action.availableSpaces[0].adjacency).to.deep.eq({bonus: [SpaceBonus.MEGACREDITS, SpaceBonus.MEGACREDITS]});
  });
});
