import {expect} from 'chai';
import {AerialMappers} from '../../../src/cards/venusNext/AerialMappers';
import {CorroderSuits} from '../../../src/cards/venusNext/CorroderSuits';
import {Dirigibles} from '../../../src/cards/venusNext/Dirigibles';
import {FloaterUrbanism} from '../../../src/cards/pathfinders/FloaterUrbanism';
import {Game} from '../../../src/Game';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/common/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('CorroderSuits', function() {
  let card : CorroderSuits; let player : Player;

  beforeEach(function() {
    card = new CorroderSuits();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Should play - no targets', function() {
    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
  });

  it('Should play - single target', function() {
    const card2 = new AerialMappers();
    player.playedCards.push(card2);

    card.play(player);
    expect(card2.resourceCount).to.eq(1);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
  });

  it('Should play - multiple targets', function() {
    const card2 = new AerialMappers();
    const card3 = new Dirigibles();
    player.playedCards.push(card2, card3);

    const action = card.play(player);
    expect(action).instanceOf(SelectCard);

        action!.cb([card2]);
        expect(card2.resourceCount).to.eq(1);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
  });

  it('Should play - specialized resource type', function() {
    const card2 = new FloaterUrbanism();
    player.playedCards.push(card2);

    card.play(player);
    expect(card2.resourceCount).to.eq(1);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
  });
});
