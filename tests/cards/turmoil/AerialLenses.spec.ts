import {expect} from 'chai';
import {AerialLenses} from '../../../src/server/cards/turmoil/AerialLenses';
import {IGame} from '../../../src/server/IGame';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {cast} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestingUtils';

describe('AerialLenses', function() {
  let card: AerialLenses;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new AerialLenses();
    [game, player, player2] = testGame(2, {turmoilExtension: true});
  });

  it('Can play', function() {
    expect(card.canPlay(player)).is.not.true;

    const kelvinists = game.turmoil!.getPartyByName(PartyName.KELVINISTS);
    kelvinists.delegates.add(player, 2);
    expect(card.canPlay(player)).is.true;
  });

  it('Should play without plants', function() {
    card.play(player);
    expect(player.production.heat).to.eq(2);
    const input = game.deferredActions.peek()!.execute();
    expect(input).is.undefined;
  });

  it('Should play with plants', function() {
    player2.plants = 5;
    card.play(player);
    expect(player.production.heat).to.eq(2);
    expect(game.deferredActions).has.lengthOf(1);

    const orOptions = cast(game.deferredActions.peek()!.execute(), OrOptions);
    orOptions.options[0].cb();
    expect(player2.plants).to.eq(3);
  });
});
