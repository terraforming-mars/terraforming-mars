import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {Ants} from '../../../src/cards/base/Ants';
import {Birds} from '../../../src/cards/base/Birds';
import {EcologicalZone} from '../../../src/cards/base/EcologicalZone';
import {Moss} from '../../../src/cards/base/Moss';
import {ViralEnhancers} from '../../../src/cards/base/ViralEnhancers';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Player} from '../../../src/Player';
import {TestPlayer} from '../../TestPlayer';

describe('ViralEnhancers', function() {
  let card: ViralEnhancers;
  let player: Player;
  let game: Game;

  beforeEach(function() {
    card = new ViralEnhancers();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Should play', function() {
    card.play();

    const ants = new Ants();
    const birds = new Birds();
    const moss = new Moss();
    player.playedCards.push(ants, birds, moss);

    card.onCardPlayed(player, birds);
    expect(game.deferredActions).has.lengthOf(1);

    const orOptions = cast(game.deferredActions.pop()!.execute(), OrOptions);
    orOptions.options[0].cb();
    expect(birds.resourceCount).to.eq(1);
    orOptions.options[1].cb();
    expect(player.plants).to.eq(1);

    card.onCardPlayed(player, ants);
    expect(game.deferredActions).has.lengthOf(1);

    const orOptions2 = cast(game.deferredActions.pop()!.execute(), OrOptions);
    orOptions2.options[0].cb();
    expect(ants.resourceCount).to.eq(1);
    orOptions2.options[1].cb();
    expect(player.plants).to.eq(2);
  });

  it('Should play for each tag', function() {
    card.play();

    const ecologicalZone = new EcologicalZone();
    card.onCardPlayed(player, ecologicalZone);
    expect(game.deferredActions).has.lengthOf(2);

    const orOptions = cast(game.deferredActions.pop()!.execute(), OrOptions);
    orOptions.options[0].cb();
    expect(ecologicalZone.resourceCount).to.eq(1);
    expect(game.deferredActions).has.lengthOf(1);

    const orOptions2 = cast(game.deferredActions.pop()!.execute(), OrOptions);
    orOptions2.options[1].cb();
    expect(player.plants).to.eq(1);
    expect(game.deferredActions).has.lengthOf(0);
  });
});
