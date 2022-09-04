import {expect} from 'chai';
import {HiTechLab} from '../../../src/server/cards/promo/HiTechLab';
import {Game} from '../../../src/server/Game';
import {SelectAmount} from '../../../src/server/inputs/SelectAmount';
import {Player} from '../../../src/server/Player';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';
import {cast} from '../../TestingUtils';

describe('HiTechLab', function() {
  let card: HiTechLab;
  let player: Player;

  beforeEach(function() {
    card = new HiTechLab();
    player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player);
  });

  it('Can not act if no energy resources available', function() {
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act', function() {
    player.addResource(Resources.ENERGY, 5);
    expect(card.canAct(player)).is.true;

    const amount = cast(card.action(player), SelectAmount);

    amount.cb(3);
    expect(player.getResource(Resources.ENERGY)).to.eq(2);
  });

  it('Should give victory points', function() {
    card.play(player);
    expect(card.getVictoryPoints()).to.eq(1);
  });
});
