import {expect} from 'chai';
import {CloudSeeding} from '../../../src/cards/base/CloudSeeding';
import {Game} from '../../../src/Game';
import {SelectPlayer} from '../../../src/inputs/SelectPlayer';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {maxOutOceans, TestPlayers} from '../../TestingUtils';

describe('CloudSeeding', function() {
  let card : CloudSeeding; let player : Player; let player2 : Player; let game : Game;

  beforeEach(function() {
    card = new CloudSeeding();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);
  });

  it('Can\'t play if cannot reduce MC production', function() {
    maxOutOceans(player, game, 3);
    player.addProduction(Resources.MEGACREDITS, -5);
    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Can\'t play if ocean requirements not met', function() {
    maxOutOceans(player, game, 2);
    player.addProduction(Resources.HEAT);
    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Can\'t play if no one has heat production', function() {
    maxOutOceans(player, game, 3);
    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Should play - auto select if single target', function() {
    // Meet requirements
    player2.addProduction(Resources.HEAT);
    maxOutOceans(player, game, 3);
    expect(card.canPlay(player, game)).is.true;

    card.play(player, game);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(-1);
    expect(player.getProduction(Resources.PLANTS)).to.eq(2);

    const input = game.deferredActions.next()!.execute();
    expect(input).is.undefined;
    expect(player2.getProduction(Resources.HEAT)).to.eq(0);
  });

  it('Should play - multiple targets', function() {
    player.addProduction(Resources.HEAT);
    player2.addProduction(Resources.HEAT);

    card.play(player, game);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(-1);
    expect(player.getProduction(Resources.PLANTS)).to.eq(2);

    expect(game.deferredActions).has.lengthOf(1);
    const selectPlayer = game.deferredActions.next()!.execute() as SelectPlayer;
    selectPlayer.cb(player2);
    expect(player2.getProduction(Resources.HEAT)).to.eq(0);
  });
});
