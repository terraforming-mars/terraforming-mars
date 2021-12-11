import {expect} from 'chai';
import {Dirigibles} from '../../../src/cards/venusNext/Dirigibles';
import {FloatingHabs} from '../../../src/cards/venusNext/FloatingHabs';
import {Game} from '../../../src/Game';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('Dirigibles', function() {
  let card : Dirigibles; let player : Player;

  beforeEach(function() {
    card = new Dirigibles();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
    player.playedCards.push(card);
  });

  it('Should play', function() {
    const action = card.play();
    expect(action).is.undefined;
  });

  it('Should act - single target', function() {
    expect(player.getFloatersCanSpend()).to.eq(0);
    const action = card.action(player);
    expect(action).is.undefined;
    expect(player.getCardsWithResources()).has.lengthOf(1);
    expect(player.getFloatersCanSpend()).to.eq(1);
    expect(card.resourceCount).to.eq(1);
  });

  it('Should act - multiple targets', function() {
    player.playedCards.push(new FloatingHabs());
    const action = card.action(player);
    expect(action).instanceOf(SelectCard);

    action!.cb([card]);
    expect(card.resourceCount).to.eq(1);
  });
});
