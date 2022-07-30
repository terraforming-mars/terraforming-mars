import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {DeimosDownPromo} from '../../../src/cards/promo/DeimosDownPromo';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {Player} from '../../../src/Player';
import {TestPlayer} from '../../TestPlayer';

describe('DeimosDownPromo', function() {
  let card: DeimosDownPromo;
  let player: Player;
  let player2: Player;

  beforeEach(function() {
    card = new DeimosDownPromo();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, player2], player);
  });

  it('Should play without plants', function() {
    const action = card.play(player);
    expect(action).instanceOf(SelectSpace);
    expect(player.game.getTemperature()).to.eq(-24);
    expect(player.steel).to.eq(4);
    const input = player.game.deferredActions.peek()!.execute();
    expect(input).is.undefined;
  });

  it('Can remove plants', function() {
    player2.plants = 5;

    const action = card.play(player);
    expect(action).instanceOf(SelectSpace);
    expect(player.game.getTemperature()).to.eq(-24);
    expect(player.steel).to.eq(4);

    expect(player.game.deferredActions).has.lengthOf(1);

    // Choose Remove 5 plants option
    const orOptions = cast(player.game.deferredActions.peek()!.execute(), OrOptions);
    orOptions.options[0].cb([player2]);

    expect(player2.plants).to.eq(0);
  });

  it('Works fine in solo mode', function() {
    Game.newInstance('gameid', [player], player);

    player.plants = 15;
    const action = card.play(player);
    expect(action).instanceOf(SelectSpace);

    expect(player.game.getTemperature()).to.eq(-24);
    expect(player.steel).to.eq(4);
    expect(player.plants).to.eq(15); // not removed
  });
});
