import {expect} from 'chai';
import {CorporateStronghold} from '../../../src/server/cards/base/CorporateStronghold';
import {Game} from '../../../src/server/Game';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TestPlayer} from '../../TestPlayer';
import {Resources} from '../../../src/common/Resources';
import {TileType} from '../../../src/common/TileType';
import {cast, runAllActions} from '../../TestingUtils';

describe('CorporateStronghold', function() {
  let card: CorporateStronghold;
  let player: TestPlayer;

  beforeEach(function() {
    card = new CorporateStronghold();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
    player.popWaitingFor(); // Removing SelectInitalCards.
  });

  it('Can not play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.production.add(Resources.ENERGY, 1);
    expect(card.canPlay(player)).is.true;

    expect(card.play(player)).is.undefined;
    runAllActions(player.game);
    const action = cast(player.popWaitingFor(), SelectSpace);
    action.cb(action.availableSpaces[0]);

    expect(action.availableSpaces[0].tile && action.availableSpaces[0].tile.tileType).to.eq(TileType.CITY);
    expect(player.production.energy).to.eq(0);
    expect(player.production.megacredits).to.eq(3);

    expect(card.getVictoryPoints()).to.eq(-2);
  });
});
