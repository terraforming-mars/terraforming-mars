import {expect} from 'chai';
import {CloudSeeding} from '../../../src/server/cards/base/CloudSeeding';
import {Game} from '../../../src/server/Game';
import {SelectPlayer} from '../../../src/server/inputs/SelectPlayer';
import {Resources} from '../../../src/common/Resources';
import {cast, maxOutOceans} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

describe('CloudSeeding', () => {
  let card: CloudSeeding;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new CloudSeeding();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, player2], player);
  });

  it('Cannot play if cannot reduce M€ production', () => {
    maxOutOceans(player, 3);
    player.production.add(Resources.MEGACREDITS, -5);
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Cannot play if ocean requirements not met', () => {
    maxOutOceans(player, 2);
    player.production.add(Resources.HEAT, 1);
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Cannot play if no one has heat production', () => {
    maxOutOceans(player, 3);
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Can play', () => {
    maxOutOceans(player, 3);
    player.production.add(Resources.MEGACREDITS, -4);
    player.production.add(Resources.HEAT, 1);
    expect(player.canPlayIgnoringCost(card)).is.true;
  });

  it('Should play - auto select if single target', () => {
    // Meet requirements
    player2.production.add(Resources.HEAT, 1);
    maxOutOceans(player, 3);
    expect(player.canPlayIgnoringCost(card)).is.true;

    card.play(player);
    expect(player.production.megacredits).to.eq(-1);
    expect(player.production.plants).to.eq(2);

    const input = game.deferredActions.peek()!.execute();
    expect(input).is.undefined;
    expect(player2.production.heat).to.eq(0);
  });

  it('Should play - multiple targets', () => {
    player.production.add(Resources.HEAT, 1);
    player2.production.add(Resources.HEAT, 1);

    card.play(player);
    expect(player.production.megacredits).to.eq(-1);
    expect(player.production.plants).to.eq(2);

    expect(game.deferredActions).has.lengthOf(1);
    const selectPlayer = cast(game.deferredActions.peek()!.execute(), SelectPlayer);
    selectPlayer.cb(player2);
    expect(player2.production.heat).to.eq(0);
  });
});
