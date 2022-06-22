import {expect} from 'chai';
import {Thermophiles} from '../../../src/cards/venusNext/Thermophiles';
import {VenusianInsects} from '../../../src/cards/venusNext/VenusianInsects';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('Thermophiles', function() {
  let card : Thermophiles; let player : Player; let game : Game;

  beforeEach(function() {
    card = new Thermophiles();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    (game as any).venusScaleLevel = 4;
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    (game as any).venusScaleLevel = 6;
    expect(player.canPlayIgnoringCost(card)).is.true;
    const action = card.play();
    expect(action).is.undefined;
  });

  it('Should act - multiple targets', function() {
    card.play();
    player.playedCards.push(card, new VenusianInsects());

    const action = card.action(player);
    expect(action).instanceOf(SelectCard);
        action!.cb([card]);
        expect(card.resourceCount).to.eq(1);

        player.addResourceTo(card);

        const orOptions = card.action(player) as OrOptions;
        expect(orOptions).is.not.undefined;
        expect(orOptions instanceof OrOptions).is.true;
        orOptions.options[0].cb();
        expect(card.resourceCount).to.eq(0);
        expect(game.getVenusScaleLevel()).to.eq(2);
  });

  it('Should act - single target', function() {
    card.play();
    player.playedCards.push(card);

    const action = card.action(player);
    expect(action instanceof SelectCard).is.not.true;
    expect(card.resourceCount).to.eq(1);

    player.addResourceTo(card);

    const orOptions = card.action(player) as OrOptions;
    expect(orOptions instanceof OrOptions).is.true;
    orOptions.options[0].cb();
    expect(card.resourceCount).to.eq(0);
    expect(game.getVenusScaleLevel()).to.eq(2);
  });
});
