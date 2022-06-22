import {expect} from 'chai';
import {MAX_TEMPERATURE} from '../../src/common/constants';
import {Game} from '../../src/Game';
import {Player} from '../../src/Player';
import {SnowCover} from '../../src/turmoil/globalEvents/SnowCover';
import {Kelvinists} from '../../src/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/turmoil/Turmoil';
import {TestPlayers} from '../TestPlayers';

describe('SnowCover', function() {
  let card : SnowCover; let player : Player; let player2: Player; let game : Game; let turmoil: Turmoil;

  beforeEach(function() {
    card = new SnowCover();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);

    turmoil = Turmoil.newInstance(game);
    turmoil.chairman = player2.id;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.push(player2.id);
    turmoil.dominantParty.delegates.push(player2.id);
  });

  it('resolve play', function() {
    card.resolve(game, turmoil);
    expect(player2.cardsInHand).has.lengthOf(3);
    expect(game.getTemperature()).to.eq(-30);

    game.increaseTemperature(player, 1);
    card.resolve(game, turmoil);
    expect(game.getTemperature()).to.eq(-30);

    game.increaseTemperature(player, 2);
    card.resolve(game, turmoil);
    expect(game.getTemperature()).to.eq(-30);

    game.increaseTemperature(player, 3);
    card.resolve(game, turmoil);
    expect(game.getTemperature()).to.eq(-28);
  });

  it('cannot reduce temperature if maxed out', function() {
    (game as any).temperature = MAX_TEMPERATURE;
    card.resolve(game, turmoil);
    expect(game.getTemperature()).to.eq(MAX_TEMPERATURE);
  });
});
