import {expect} from 'chai';
import {HiTechLab} from '../../../src/cards/promo/HiTechLab';
import {Game} from '../../../src/Game';
import {SelectAmount} from '../../../src/inputs/SelectAmount';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/common/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('HiTechLab', function() {
  let card : HiTechLab; let player : Player;

  beforeEach(function() {
    card = new HiTechLab();
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player);
  });

  it('Can\'t act if no energy resources available', function() {
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act', function() {
    player.addResource(Resources.ENERGY, 5);
    expect(card.canAct(player)).is.true;

    const amount = card.action(player) as SelectAmount;
    expect(amount instanceof SelectAmount).is.true;

        amount!.cb(3);
        expect(player.getResource(Resources.ENERGY)).to.eq(2);
  });

  it('Should give victory points', function() {
    card.play();
    expect(card.getVictoryPoints()).to.eq(1);
  });
});
