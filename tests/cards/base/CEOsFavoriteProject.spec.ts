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
import {MicroMills} from '../../../src/server/cards/base/MicroMills';
import {CardName} from '../../../src/common/cards/CardName';
import {Tardigrades} from '../../../src/server/cards/base/Tardigrades';

describe('CEOsFavoriteProject', () => {
  let card: CEOsFavoriteProject;
  let player: TestPlayer;

  beforeEach(() => {
    card = new CEOsFavoriteProject();
    [/* game */, player] = testGame(2);
  });

  it('Can not play - no cards', () => {
    expect(card.canPlay(player)).is.false;
  });

  it('Can not play - no cards that take resources', () => {
    player.playedCards.push(new MicroMills());
    expect(card.canPlay(player)).is.false;
  });

  it('Can not play - no cards that have r esources', () => {
    player.playedCards.push(new MicroMills(), new SecurityFleet());
    expect(card.canPlay(player)).is.false;
  });

  it('Can play', () => {
    const securityFleet = new SecurityFleet();
    player.playedCards.push(new MicroMills(), securityFleet);
    securityFleet.resourceCount = 1;
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', () => {
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

  it('Can play on SelfReplicatingRobots cards', () => {
    const srr = new SelfReplicatingRobots();
    const birds = new Birds();
    player.playedCards.push(srr);
    srr.targetCards.push(birds);
    birds.resourceCount = 1;
    cast(card.play(player), undefined);
    runAllActions(player.game);
    cast(player.popWaitingFor(), undefined);
    expect(srr.targetCards[0].resourceCount).to.eq(2);
  });

  it('Cannot play on card with no resources', () => {
    const birds = new Birds();
    const securityFleet = new SecurityFleet();
    securityFleet.resourceCount++;
    const tardigrades = new Tardigrades();
    tardigrades.resourceCount++;
    player.playedCards.push(securityFleet, birds, tardigrades);
    cast(card.play(player), undefined);
    runAllActions(player.game);
    const action = cast(player.popWaitingFor(), SelectCard<ICard>);
    expect(action.cards).does.not.contain(birds);
    expect(action.cards).does.contain(securityFleet);
    expect(action.cards).does.contain(tardigrades);
    // This line really just tests SelectCard, but that's OK.
    expect(() => action.process({type: 'card', cards: [CardName.BIRDS]})).to.throw(Error, /Card Birds not found/);
  });
});
