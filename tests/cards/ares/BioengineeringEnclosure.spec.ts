import {AICentral} from '../../../src/cards/base/AICentral';
import {BioengineeringEnclosure} from '../../../src/cards/ares/BioengineeringEnclosure';
import {Birds} from '../../../src/cards/base/Birds';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {expect} from 'chai';
import {ARES_OPTIONS_NO_HAZARDS} from '../../ares/AresTestHelper';
import {TestPlayers} from '../../TestingUtils';

describe('BioengineeringEnclosure', function() {
  let card : BioengineeringEnclosure; let player : Player; let game : Game;
  let animalHost: IProjectCard = new Birds();

  beforeEach(function() {
    animalHost = new Birds();
    card = new BioengineeringEnclosure();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player, ARES_OPTIONS_NO_HAZARDS);
  });

  it('Can\'t play without a science tag', () => {
    expect(card.canPlay(player)).is.false;
    player.playCard(new AICentral());
    expect(card.canPlay(player)).is.true;
  });

  it('Play', () => {
    expect(card.resourceCount).eq(0);
    card.play(player);
    expect(card.resourceCount).eq(2);
  });

  it('Can\'t move animal if it\'s empty', () => {
    card.play(player);
    player.playCard(animalHost);
    card.resourceCount = 0;
    expect(card.canAct(player)).is.false;
  });

  it('Can\'t move animal if theres not another card', () => {
    card.play(player);
    expect(card.canAct(player)).is.false;
  });

  it('Move animal', () => {
    // Set up the cards.
    player.playCard(animalHost);
    game.deferredActions.pop();
    player.playCard(card);

    // Initial expectations that will change after playing the card.
    expect(card.canAct(player)).is.true;
    expect(card.resourceCount).eq(2);
    expect(animalHost.resourceCount).eq(0);
    expect(game.deferredActions).has.lengthOf(0);

    card.action(player);

    game.deferredActions.peek()!.execute();

    expect(card.resourceCount).eq(1);
    expect(animalHost.resourceCount).eq(1);
  });
});
