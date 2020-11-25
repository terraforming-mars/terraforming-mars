import {expect} from 'chai';
import {ViralEnhancers} from '../../../src/cards/base/ViralEnhancers';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {Ants} from '../../../src/cards/base/Ants';
import {Birds} from '../../../src/cards/base/Birds';
import {Moss} from '../../../src/cards/base/Moss';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {EcologicalZone} from '../../../src/cards/base/EcologicalZone';

describe('ViralEnhancers', function() {
  let card : ViralEnhancers; let player : Player; let game : Game;

  beforeEach(function() {
    card = new ViralEnhancers();
    player = new Player('test', Color.BLUE, false);
    game = new Game('foobar', [player, player], player);
  });

  it('Should play', function() {
    card.play();

    const ants = new Ants();
    const birds = new Birds();
    const moss = new Moss();
    player.playedCards.push(ants, birds, moss);

    card.onCardPlayed(player, game, birds);
    expect(game.deferredActions).has.lengthOf(1);

    const orOptions = game.deferredActions.shift()!.execute() as OrOptions;
    orOptions.options[0].cb();
    expect(player.getResourcesOnCard(birds)).to.eq(1);
    orOptions.options[1].cb();
    expect(player.plants).to.eq(1);

    card.onCardPlayed(player, game, ants);
    expect(game.deferredActions).has.lengthOf(1);

    const orOptions2 = game.deferredActions.shift()!.execute() as OrOptions;
    orOptions2.options[0].cb();
    expect(player.getResourcesOnCard(ants)).to.eq(1);
    orOptions2.options[1].cb();
    expect(player.plants).to.eq(2);
  });

  it('Should play for each tag', function() {
    card.play();

    const ecologicalZone = new EcologicalZone();
    card.onCardPlayed(player, game, ecologicalZone);
    expect(game.deferredActions).has.lengthOf(2);

    const orOptions = game.deferredActions.shift()!.execute() as OrOptions;
    orOptions.options[0].cb();
    expect(player.getResourcesOnCard(ecologicalZone)).to.eq(1);
    expect(game.deferredActions).has.lengthOf(1);

    const orOptions2 = game.deferredActions.shift()!.execute() as OrOptions;
    orOptions2.options[1].cb();
    expect(player.plants).to.eq(1);
    expect(game.deferredActions).has.lengthOf(0);
  });
});
