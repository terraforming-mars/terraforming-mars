import {expect} from 'chai';
import {Research} from '../../../src/cards/base/Research';
import {VenusianAnimals} from '../../../src/cards/venusNext/VenusianAnimals';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestingUtils';

describe('VenusianAnimals', function() {
  let card : VenusianAnimals; let player : Player; let game : Game;

  beforeEach(function() {
    card = new VenusianAnimals();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = new Game('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    (game as any).venusScaleLevel = 16;
    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Should play', function() {
    (game as any).venusScaleLevel = 18;
    expect(card.canPlay(player, game)).is.true;
    player.playedCards.push(card);
    card.play();

    card.onCardPlayed(player, game, card);
    expect(player.getResourcesOnCard(card)).to.eq(1);

    card.onCardPlayed(player, game, new Research());
    expect(player.getResourcesOnCard(card)).to.eq(3);

    expect(card.getVictoryPoints()).to.eq(3);
  });
});
