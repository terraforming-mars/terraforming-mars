import {expect} from 'chai';
import {AerialLenses} from '../../../src/server/cards/turmoil/AerialLenses';
import {Game} from '../../../src/server/Game';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {cast} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

describe('AerialLenses', function() {
  let card: AerialLenses;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new AerialLenses();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();

    game = Game.newInstance('gameid', [player, player2], player, {turmoilExtension: true});
  });

  it('Can play', function() {
    expect(player.simpleCanPlay(card)).is.not.true;

    const kelvinists = game.turmoil!.getPartyByName(PartyName.KELVINISTS);
    kelvinists.delegates.add(player, 2);
    expect(player.simpleCanPlay(card)).is.true;
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
