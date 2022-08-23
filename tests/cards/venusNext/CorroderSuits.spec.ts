import {expect} from 'chai';
import {AerialMappers} from '../../../src/server/cards/venusNext/AerialMappers';
import {CorroderSuits} from '../../../src/server/cards/venusNext/CorroderSuits';
import {Dirigibles} from '../../../src/server/cards/venusNext/Dirigibles';
import {FloaterUrbanism} from '../../../src/server/cards/pathfinders/FloaterUrbanism';
import {Game} from '../../../src/server/Game';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('CorroderSuits', function() {
  let card: CorroderSuits;
  let player: Player;

  beforeEach(function() {
    card = new CorroderSuits();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Should play - no targets', function() {
    card.play(player);
    expect(player.production.megacredits).to.eq(2);
  });

  it('Should play - single target', function() {
    const card2 = new AerialMappers();
    player.playedCards.push(card2);

    card.play(player);
    expect(card2.resourceCount).to.eq(1);
    expect(player.production.megacredits).to.eq(2);
  });

  it('Should play - multiple targets', function() {
    const card2 = new AerialMappers();
    const card3 = new Dirigibles();
    player.playedCards.push(card2, card3);

    const action = card.play(player);
    expect(action).instanceOf(SelectCard);

        action!.cb([card2]);
        expect(card2.resourceCount).to.eq(1);
        expect(player.production.megacredits).to.eq(2);
  });

  it('Should play - specialized resource type', function() {
    const card2 = new FloaterUrbanism();
    player.playedCards.push(card2);

    card.play(player);
    expect(card2.resourceCount).to.eq(1);
    expect(player.production.megacredits).to.eq(2);
  });
});
