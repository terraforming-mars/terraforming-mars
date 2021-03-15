import {expect} from 'chai';
import {Ants} from '../../../src/cards/base/Ants';
import {Birds} from '../../../src/cards/base/Birds';
import {EcologicalZone} from '../../../src/cards/base/EcologicalZone';
import {Moss} from '../../../src/cards/base/Moss';
import {ViralEnhancers} from '../../../src/cards/base/ViralEnhancers';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('ViralEnhancers', function() {
  let card : ViralEnhancers; let player : Player; let game : Game;

  beforeEach(function() {
    card = new ViralEnhancers();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Should play', function() {
    card.play();

    const ants = new Ants();
    const birds = new Birds();
    const moss = new Moss();
    player.playedCards.push(ants, birds, moss);

    card.onCardPlayed(player, birds);
    expect(game.deferredActions).has.lengthOf(1);

    const orOptions = game.deferredActions.pop()!.execute() as OrOptions;
    orOptions.options[0].cb();
    expect(player.getResourcesOnCard(birds)).to.eq(1);
    orOptions.options[1].cb();
    expect(player.plants).to.eq(1);

    card.onCardPlayed(player, ants);
    expect(game.deferredActions).has.lengthOf(1);

    const orOptions2 = game.deferredActions.pop()!.execute() as OrOptions;
    orOptions2.options[0].cb();
    expect(player.getResourcesOnCard(ants)).to.eq(1);
    orOptions2.options[1].cb();
    expect(player.plants).to.eq(2);
  });

  it('Should play for each tag', function() {
    card.play();

    const ecologicalZone = new EcologicalZone();
    card.onCardPlayed(player, ecologicalZone);
    expect(game.deferredActions).has.lengthOf(2);

    const orOptions = game.deferredActions.pop()!.execute() as OrOptions;
    orOptions.options[0].cb();
    expect(player.getResourcesOnCard(ecologicalZone)).to.eq(1);
    expect(game.deferredActions).has.lengthOf(1);

    const orOptions2 = game.deferredActions.pop()!.execute() as OrOptions;
    orOptions2.options[1].cb();
    expect(player.plants).to.eq(1);
    expect(game.deferredActions).has.lengthOf(0);
  });
});
