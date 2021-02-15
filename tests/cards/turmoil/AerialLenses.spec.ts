import {expect} from 'chai';
import {AerialLenses} from '../../../src/cards/turmoil/AerialLenses';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {PartyName} from '../../../src/turmoil/parties/PartyName';
import {setCustomGameOptions, TestPlayers} from '../../TestingUtils';

describe('AerialLenses', function() {
  let card : AerialLenses; let player : Player; let player2 : Player; let game : Game;

  beforeEach(function() {
    card = new AerialLenses();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();

    const gameOptions = setCustomGameOptions();
    game = Game.newInstance('foobar', [player, player2], player, gameOptions);
  });

  it('Can play', function() {
    expect(card.canPlay(player)).is.not.true;

    const kelvinists = game.turmoil!.getPartyByName(PartyName.KELVINISTS)!;
    kelvinists.delegates.push(player.id, player.id);
    expect(card.canPlay(player)).is.true;
  });

  it('Should play without plants', function() {
    card.play(player);
    expect(player.getProduction(Resources.HEAT)).to.eq(2);
    const input = game.deferredActions.peek()!.execute();
    expect(input).is.undefined;
  });

  it('Should play with plants', function() {
    player2.plants = 5;
    card.play(player);
    expect(player.getProduction(Resources.HEAT)).to.eq(2);
    expect(game.deferredActions).has.lengthOf(1);

    const orOptions = game.deferredActions.peek()!.execute() as OrOptions;
    orOptions.options[0].cb();
    expect(player2.plants).to.eq(3);
  });
});
