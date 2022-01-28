import {expect} from 'chai';
import {Ants} from '../../../src/cards/base/Ants';
import {Fish} from '../../../src/cards/base/Fish';
import {ICard} from '../../../src/cards/ICard';
import {MoholeLake} from '../../../src/cards/promo/MoholeLake';
import {Game} from '../../../src/Game';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('MoholeLake', function() {
  let card : MoholeLake; let player : Player;

  beforeEach(function() {
    card = new MoholeLake();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can play', function() {
    card.play(player);

    expect(player.game.deferredActions).has.lengthOf(1);
    const selectSpace = player.game.deferredActions.peek()!.execute() as SelectSpace;
    selectSpace.cb(selectSpace.availableSpaces[0]);

    expect(player.game.getTemperature()).to.eq(-28);
    expect(player.game.board.getOceanCount()).to.eq(1);
    expect(player.getTerraformRating()).to.eq(22);
    expect(player.plants).to.eq(3);
  });

  it('Can act - no target', function() {
    expect(card.canAct()).is.true;
    expect(card.action(player)).is.undefined;
  });

  it('Can act - single target', function() {
    const fish = new Fish();
    player.playedCards.push(fish);

    card.play(player);
    expect(card.canAct()).is.true;
    card.action(player);
    expect(fish.resourceCount).to.eq(1);
  });

  it('Can act - multiple targets', function() {
    const fish = new Fish();
    const ants = new Ants();
    player.playedCards.push(fish, ants);

    card.play(player);
    expect(card.canAct()).is.true;
    const action = card.action(player) as SelectCard<ICard>;

    action.cb([ants]);
    expect(ants.resourceCount).to.eq(1);
  });
});
