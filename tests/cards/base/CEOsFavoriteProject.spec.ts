import {expect} from 'chai';
import {cast, runAllActions} from '../../TestingUtils';
import {Birds} from '../../../src/server/cards/base/Birds';
import {CEOsFavoriteProject} from '../../../src/server/cards/base/CEOsFavoriteProject';
import {Decomposers} from '../../../src/server/cards/base/Decomposers';
import {SearchForLife} from '../../../src/server/cards/base/SearchForLife';
import {SecurityFleet} from '../../../src/server/cards/base/SecurityFleet';
import {SelfReplicatingRobots} from '../../../src/server/cards/promo/SelfReplicatingRobots';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {TestPlayer} from '../../TestPlayer';
import {ICard} from '../../../src/server/cards/ICard';
import {testGame} from '../../TestGame';

describe('CEOsFavoriteProject', function() {
  let card: CEOsFavoriteProject;
  let player: TestPlayer;

  beforeEach(function() {
    card = new CEOsFavoriteProject();
    [/* skipped */, player] = testGame(2);
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

    cast(card.play(player), undefined);
    runAllActions(player.game);
    const action = cast(player.popWaitingFor(), SelectCard<ICard>);

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
    srr.targetCards.push({card: birds, resourceCount: 1});
    cast(card.play(player), undefined);
    runAllActions(player.game);
    const action = cast(player.popWaitingFor(), SelectCard<ICard>);
    action.cb([birds]);
    expect(srr.targetCards[0].resourceCount).to.eq(2);
  });

  it('Cannot play on card with no resources', function() {
    const birds = new Birds();
    const securityFleet = new SecurityFleet();
    securityFleet.resourceCount++;
    player.playedCards.push(securityFleet, birds);
    cast(card.play(player), undefined);
    runAllActions(player.game);
    const action = cast(player.popWaitingFor(), SelectCard<ICard>);
    expect(action.cards).does.not.contain(birds);
    expect(action.cards).does.contain(securityFleet);
    expect(() => action.cb([birds])).to.throw(Error, /Invalid card/);
  });
});
