import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {Birds} from '../../../src/server/cards/base/Birds';
import {CEOsFavoriteProject} from '../../../src/server/cards/base/CEOsFavoriteProject';
import {Decomposers} from '../../../src/server/cards/base/Decomposers';
import {SearchForLife} from '../../../src/server/cards/base/SearchForLife';
import {SecurityFleet} from '../../../src/server/cards/base/SecurityFleet';
import {SelfReplicatingRobots} from '../../../src/server/cards/promo/SelfReplicatingRobots';
import {Game} from '../../../src/server/Game';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';
import {ICard} from '../../../src/server/cards/ICard';

describe('CEOsFavoriteProject', function() {
  let card: CEOsFavoriteProject;
  let player: Player;

  beforeEach(function() {
    card = new CEOsFavoriteProject();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    const searchForLife = new SearchForLife();
    const securityFleet = new SecurityFleet();
    const decomposers = new Decomposers();
    const birds = new Birds();

    player.playedCards.push(searchForLife, securityFleet, decomposers, birds);
    player.addResourceTo(securityFleet);
    player.addResourceTo(decomposers);
    player.addResourceTo(searchForLife);
    player.addResourceTo(birds);

    const action = cast(card.play(player), SelectCard<ICard>);

    action.cb([searchForLife]);
    expect(searchForLife.resourceCount).to.eq(2);
    action.cb([birds]);
    expect(birds.resourceCount).to.eq(2);
    action.cb([decomposers]);
    expect(decomposers.resourceCount).to.eq(2);
    action.cb([securityFleet]);
    expect(securityFleet.resourceCount).to.eq(2);
  });

  it('Can play on SelfReplicatingRobots cards', function() {
    const srr = new SelfReplicatingRobots();
    const birds = new Birds();
    player.playedCards.push(srr);
    srr.targetCards.push({card: birds, resourceCount: 0});
    const action = cast(card.play(player), SelectCard<ICard>);
    action.cb([birds]);
    expect(srr.targetCards[0].resourceCount).to.eq(1);
  });

  it('Cannot play on card with no resources', function() {
    const birds = new Birds();
    const securityFleet = new SecurityFleet();
    securityFleet.resourceCount++;
    player.playedCards.push(securityFleet, birds);
    const action = cast(card.play(player), SelectCard<ICard>);
    expect(action.cards).does.not.contain(birds);
    expect(action.cards).does.contain(securityFleet);
    expect(() => action.cb([birds])).to.throw(Error, /Invalid card/);
  });
});
