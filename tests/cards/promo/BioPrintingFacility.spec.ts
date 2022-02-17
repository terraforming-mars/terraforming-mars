import {expect} from 'chai';
import {SmallAnimals} from '../../../src/cards/base/SmallAnimals';
import {BioPrintingFacility} from '../../../src/cards/promo/BioPrintingFacility';
import {Fish} from '../../../src/cards/base/Fish';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('BioPrintingFacility', function() {
  let card : BioPrintingFacility; let player : Player; let player2 : Player;

  beforeEach(function() {
    card = new BioPrintingFacility();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, player2], player);
    player.playedCards.push(card);
  });

  it('Should play', function() {
    const action = card.play();
    expect(action).is.undefined;
  });


  it('Can\'t act', function() {
    player.energy = 1;
    expect(card.canAct(player)).is.not.true;
  });

  it('Can act', function() {
    player.energy = 3;
    expect(card.canAct(player));
  });

  it('Should act - single target', function() {
    const smallanimals = new SmallAnimals();
    player.playedCards.push(smallanimals);
    player.energy = 2;

    const action = card.action(player);
    expect(action).instanceOf(OrOptions);
    expect(action!.options).has.lengthOf(2);

    action!.options[0].cb();
    expect(smallanimals.resourceCount).to.eq(1);

    action!.options[1].cb();
    expect(player.plants).to.eq(2);
  });

  it('Should act - multiple targets', function() {
    const smallanimals = new SmallAnimals();
    const fish = new Fish();
    player.playedCards.push(smallanimals, fish);
    player.energy = 2;

    const action = card.action(player);
    expect(action).instanceOf(OrOptions);
    expect(action!.options).has.lengthOf(2);

    action!.options[0].cb([smallanimals]);
    expect(smallanimals.resourceCount).to.eq(1);

    action!.options[0].cb([fish]);
    expect(fish.resourceCount).to.eq(1);
  });
});
