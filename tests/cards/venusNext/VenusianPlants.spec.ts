import {expect} from 'chai';
import {Thermophiles} from '../../../src/cards/venusNext/Thermophiles';
import {VenusianAnimals} from '../../../src/cards/venusNext/VenusianAnimals';
import {VenusianPlants} from '../../../src/cards/venusNext/VenusianPlants';
import {Game} from '../../../src/Game';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestingUtils';

describe('VenusianPlants', function() {
  let card : VenusianPlants; let player : Player; let game : Game;

  beforeEach(function() {
    card = new VenusianPlants();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    (game as any).venusScaleLevel = 14;
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play - multiple targets', function() {
    (game as any).venusScaleLevel = 16;
    expect(card.canPlay(player)).is.true;

    const card2 = new Thermophiles();
    const card3 = new VenusianAnimals();
    player.playedCards.push(card2, card3);

    const action = card.play(player);
    expect(action instanceof SelectCard).is.true;

        action!.cb([card2]);
        expect(player.getResourcesOnCard(card2)).to.eq(1);
        expect(game.getVenusScaleLevel()).to.eq(18);
  });

  it('Should play - single target', function() {
    const card2 = new Thermophiles();
    player.playedCards.push(card2);
    (game as any).venusScaleLevel = 16;

    card.play(player);
    expect(player.getResourcesOnCard(card2)).to.eq(1);
    expect(game.getVenusScaleLevel()).to.eq(18);
  });
});
