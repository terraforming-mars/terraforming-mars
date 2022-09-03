import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {Ants} from '../../../src/server/cards/base/Ants';
import {Fish} from '../../../src/server/cards/base/Fish';
import {ICard} from '../../../src/server/cards/ICard';
import {MoholeLake} from '../../../src/server/cards/promo/MoholeLake';
import {Game} from '../../../src/server/Game';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('MoholeLake', function() {
  let card: MoholeLake;
  let player: Player;

  beforeEach(function() {
    card = new MoholeLake();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can play', function() {
    card.play(player);

    expect(player.game.deferredActions).has.lengthOf(1);
    const selectSpace = cast(player.game.deferredActions.peek()!.execute(), SelectSpace);
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
    const action = cast(card.action(player), SelectCard<ICard>);

    action.cb([ants]);
    expect(ants.resourceCount).to.eq(1);
  });
});
