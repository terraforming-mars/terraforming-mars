import {expect} from 'chai';
import {BusinessNetwork} from '../../../src/cards/base/BusinessNetwork';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {Resources} from '../../../src/common/Resources';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {TestPlayers} from '../../TestPlayers';

describe('BusinessNetwork', function() {
  let card : BusinessNetwork; let player : Player; let game : Game;

  beforeEach(function() {
    card = new BusinessNetwork();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Should play', function() {
    expect(card.canPlay(player)).is.true;
    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(-1);
  });

  it('Can\'t play', function() {
    player.addProduction(Resources.MEGACREDITS, -5);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can act', function() {
    expect(card.canAct()).is.true;
  });

  it('Cannot buy card if cannot pay', function() {
    player.megaCredits = 2;
    const action = card.action(player);
    expect(action).instanceOf(SelectCard);
    expect(action!.config.max).to.eq(0);

    (action! as SelectCard<IProjectCard>).cb([]);
    expect(game.dealer.discarded).has.lengthOf(1);
    expect(player.cardsInHand).has.lengthOf(0);
    expect(player.megaCredits).to.eq(2);
  });

  it('Should action as not helion', function() {
    player.megaCredits = 3;
    const action = card.action(player);
    expect(action).instanceOf(SelectCard);

    (action! as SelectCard<IProjectCard>).cb([]);
    expect(game.dealer.discarded).has.lengthOf(1);
    expect(player.megaCredits).to.eq(3);

    player.megaCredits = 3;
    (action as SelectCard<IProjectCard>).cb([(action as SelectCard<IProjectCard>).cards[0]]);
    expect(game.deferredActions).has.lengthOf(1);
    game.deferredActions.runNext();
    expect(player.megaCredits).to.eq(0);
    expect(player.cardsInHand).has.lengthOf(1);
  });
});
