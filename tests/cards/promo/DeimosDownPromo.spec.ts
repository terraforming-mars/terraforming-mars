import {expect} from 'chai';
import {cast, runAllActions} from '../../TestingUtils';
import {DeimosDownPromo} from '../../../src/server/cards/promo/DeimosDownPromo';
import {IGame} from '../../../src/server/IGame';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('DeimosDownPromo', function() {
  let card: DeimosDownPromo;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new DeimosDownPromo();
    [game, player, player2] = testGame(2);
  });

  it('Should play without plants', function() {
    expect(card.play(player)).is.undefined;
    runAllActions(game);
    cast(player.popWaitingFor(), SelectSpace);
    expect(player.game.getTemperature()).to.eq(-24);
    expect(player.steel).to.eq(4);
    const input = player.game.deferredActions.peek()!.execute();
    expect(input).is.undefined;
  });

  it('Can remove plants', function() {
    player2.plants = 5;

    expect(card.play(player)).is.undefined;
    runAllActions(game);
    cast(player.popWaitingFor(), SelectSpace);
    expect(player.game.getTemperature()).to.eq(-24);
    expect(player.steel).to.eq(4);

    expect(player.game.deferredActions).has.lengthOf(1);

    // Choose Remove 5 plants option
    const orOptions = cast(player.game.deferredActions.peek()!.execute(), OrOptions);
    orOptions.options[0].cb([player2]);

    expect(player2.plants).to.eq(0);
  });

  it('Works fine in solo mode', function() {
    const [game, player] = testGame(1);

    player.plants = 15;
    expect(card.play(player)).is.undefined;
    runAllActions(game);
    cast(player.popWaitingFor(), SelectSpace);

    expect(player.game.getTemperature()).to.eq(-24);
    expect(player.steel).to.eq(4);
    expect(player.plants).to.eq(15); // not removed
  });
});
