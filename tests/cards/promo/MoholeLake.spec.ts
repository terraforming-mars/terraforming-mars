import {expect} from 'chai';
import {Ants} from '../../../src/cards/base/Ants';
import {Fish} from '../../../src/cards/base/Fish';
import {ICard} from '../../../src/cards/ICard';
import {MoholeLake} from '../../../src/cards/promo/MoholeLake';
import {Game} from '../../../src/Game';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestingUtils';

describe('MoholeLake', function() {
  let card : MoholeLake; let player : Player; let game : Game;

  beforeEach(function() {
    card = new MoholeLake();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can play', function() {
    card.play(player, game);

    expect(game.deferredActions).has.lengthOf(1);
    const selectSpace = game.deferredActions.next()!.execute() as SelectSpace;
    selectSpace.cb(selectSpace.availableSpaces[0]);

    expect(game.getTemperature()).to.eq(-28);
    expect(game.board.getOceansOnBoard()).to.eq(1);
    expect(player.getTerraformRating()).to.eq(22);
    expect(player.plants).to.eq(3);
  });

  it('Can\'t act', function() {
    card.play(player, game);
    expect(card.canAct(player)).is.not.true;
  });

  it('Can act - single target', function() {
    const fish = new Fish();
    player.playedCards.push(fish);

    card.play(player, game);
    expect(card.canAct(player)).is.true;
    card.action(player, game);
    expect(fish.resourceCount).to.eq(1);
  });

  it('Can act - multiple targets', function() {
    const fish = new Fish();
    const ants = new Ants();
    player.playedCards.push(fish, ants);

    card.play(player, game);
    expect(card.canAct(player)).is.true;
    const action = card.action(player, game) as SelectCard<ICard>;

    action.cb([ants]);
    expect(ants.resourceCount).to.eq(1);
  });
});
