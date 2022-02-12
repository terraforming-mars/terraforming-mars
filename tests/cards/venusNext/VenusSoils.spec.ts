import {expect} from 'chai';
import {Thermophiles} from '../../../src/cards/venusNext/Thermophiles';
import {VenusianInsects} from '../../../src/cards/venusNext/VenusianInsects';
import {VenusSoils} from '../../../src/cards/venusNext/VenusSoils';
import {Game} from '../../../src/Game';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/common/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('VenusSoils', function() {
  let card : VenusSoils; let player : Player; let game : Game;

  beforeEach(function() {
    card = new VenusSoils();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Should play - single target', function() {
    const card2 = new Thermophiles();
    player.playedCards.push(card2);
    card.play(player);

    expect(card2.resourceCount).to.eq(2);
    expect(player.getProduction(Resources.PLANTS)).to.eq(1);
    expect(game.getVenusScaleLevel()).to.eq(2);
  });

  it('Should play - multiple targets', function() {
    const card2 = new Thermophiles();
    const card3 = new VenusianInsects();
    player.playedCards.push(card2, card3);

    const action = card.play(player);
    expect(action).instanceOf(SelectCard);

        action!.cb([card2]);
        expect(card2.resourceCount).to.eq(2);
        expect(player.getProduction(Resources.PLANTS)).to.eq(1);
        expect(game.getVenusScaleLevel()).to.eq(2);
  });
});
