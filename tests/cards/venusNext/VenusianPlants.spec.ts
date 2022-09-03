import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {Thermophiles} from '../../../src/server/cards/venusNext/Thermophiles';
import {VenusianAnimals} from '../../../src/server/cards/venusNext/VenusianAnimals';
import {VenusianPlants} from '../../../src/server/cards/venusNext/VenusianPlants';
import {Game} from '../../../src/server/Game';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('VenusianPlants', function() {
  let card: VenusianPlants;
  let player: Player;
  let game: Game;

  beforeEach(function() {
    card = new VenusianPlants();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play', function() {
    (game as any).venusScaleLevel = 14;
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play - multiple targets', function() {
    (game as any).venusScaleLevel = 16;
    expect(player.canPlayIgnoringCost(card)).is.true;

    const card2 = new Thermophiles();
    const card3 = new VenusianAnimals();
    player.playedCards.push(card2, card3);

    const action = cast(card.play(player), SelectCard);
    action.cb([card2]);

    expect(card2.resourceCount).to.eq(1);
    expect(game.getVenusScaleLevel()).to.eq(18);
  });

  it('Should play - single target', function() {
    const card2 = new Thermophiles();
    player.playedCards.push(card2);
    (game as any).venusScaleLevel = 16;

    card.play(player);
    expect(card2.resourceCount).to.eq(1);
    expect(game.getVenusScaleLevel()).to.eq(18);
  });
});
