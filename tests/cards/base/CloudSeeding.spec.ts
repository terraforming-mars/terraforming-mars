import {expect} from 'chai';
import {CloudSeeding} from '../../../src/cards/base/CloudSeeding';
import {Game} from '../../../src/Game';
import {SelectPlayer} from '../../../src/inputs/SelectPlayer';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/common/Resources';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('CloudSeeding', () => {
  let card : CloudSeeding; let player : Player; let player2 : Player; let game : Game;

  beforeEach(() => {
    card = new CloudSeeding();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);
  });

  it('Cannot play if cannot reduce M€ production', () => {
    TestingUtils.maxOutOceans(player, 3);
    player.addProduction(Resources.MEGACREDITS, -5);
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Cannot play if ocean requirements not met', () => {
    TestingUtils.maxOutOceans(player, 2);
    player.addProduction(Resources.HEAT, 1);
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Cannot play if no one has heat production', () => {
    TestingUtils.maxOutOceans(player, 3);
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Can play', () => {
    TestingUtils.maxOutOceans(player, 3);
    player.addProduction(Resources.MEGACREDITS, -4);
    player.addProduction(Resources.HEAT, 1);
    expect(player.canPlayIgnoringCost(card)).is.true;
  });

  it('Should play - auto select if single target', () => {
    // Meet requirements
    player2.addProduction(Resources.HEAT, 1);
    TestingUtils.maxOutOceans(player, 3);
    expect(player.canPlayIgnoringCost(card)).is.true;

    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(-1);
    expect(player.getProduction(Resources.PLANTS)).to.eq(2);

    const input = game.deferredActions.peek()!.execute();
    expect(input).is.undefined;
    expect(player2.getProduction(Resources.HEAT)).to.eq(0);
  });

  it('Should play - multiple targets', () => {
    player.addProduction(Resources.HEAT, 1);
    player2.addProduction(Resources.HEAT, 1);

    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(-1);
    expect(player.getProduction(Resources.PLANTS)).to.eq(2);

    expect(game.deferredActions).has.lengthOf(1);
    const selectPlayer = game.deferredActions.peek()!.execute() as SelectPlayer;
    selectPlayer.cb(player2);
    expect(player2.getProduction(Resources.HEAT)).to.eq(0);
  });
});
