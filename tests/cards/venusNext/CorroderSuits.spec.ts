import {expect} from 'chai';
import {AerialMappers} from '../../../src/server/cards/venusNext/AerialMappers';
import {CorroderSuits} from '../../../src/server/cards/venusNext/CorroderSuits';
import {Dirigibles} from '../../../src/server/cards/venusNext/Dirigibles';
import {FloaterUrbanism} from '../../../src/server/cards/pathfinders/FloaterUrbanism';
import {Game} from '../../../src/server/Game';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions} from '../../TestingUtils';

describe('CorroderSuits', function() {
  let card: CorroderSuits;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new CorroderSuits();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
    player.popSelectInitialCards();
  });

  it('Should play - no targets', function() {
    card.play(player);
    expect(player.production.megacredits).to.eq(2);
  });

  it('Should play - single target', function() {
    const card2 = new AerialMappers();
    player.playedCards.push(card2);

    card.play(player);
    runAllActions(game);

    expect(card2.resourceCount).to.eq(1);
    expect(player.production.megacredits).to.eq(2);
  });

  it('Should play - multiple targets', function() {
    const card2 = new AerialMappers();
    const card3 = new Dirigibles();
    player.playedCards.push(card2, card3);

    expect(card.play(player)).is.undefined;
    runAllActions(game);

    const action = cast(player.popWaitingFor(), SelectCard);
    action.cb([card2]);
    expect(card2.resourceCount).to.eq(1);
    expect(player.production.megacredits).to.eq(2);
  });

  it('Should play - specialized resource type', function() {
    const card2 = new FloaterUrbanism();
    player.playedCards.push(card2);

    card.play(player);
    runAllActions(game);

    expect(card2.resourceCount).to.eq(1);
    expect(player.production.megacredits).to.eq(2);
  });
});
