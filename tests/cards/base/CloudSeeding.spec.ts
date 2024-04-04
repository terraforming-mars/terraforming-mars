import {expect} from 'chai';
import {CloudSeeding} from '../../../src/server/cards/base/CloudSeeding';
import {Game} from '../../../src/server/Game';
import {SelectPlayer} from '../../../src/server/inputs/SelectPlayer';
import {Resource} from '../../../src/common/Resource';
import {cast, maxOutOceans} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('CloudSeeding', () => {
  let card: CloudSeeding;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new CloudSeeding();
    [game, player, player2] = testGame(2);
  });

  it('Cannot play if cannot reduce M€ production', () => {
    maxOutOceans(player, 3);
    player.production.add(Resource.MEGACREDITS, -5);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Cannot play if ocean requirements not met', () => {
    maxOutOceans(player, 2);
    player.production.add(Resource.HEAT, 1);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Cannot play if no one has heat production', () => {
    maxOutOceans(player, 3);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can play', () => {
    maxOutOceans(player, 3);
    player.production.add(Resource.MEGACREDITS, -4);
    player.production.add(Resource.HEAT, 1);
    expect(card.canPlay(player)).is.true;
  });

  it('Should play - auto select if single target', () => {
    // Meet requirements
    player2.production.add(Resource.HEAT, 1);
    maxOutOceans(player, 3);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.production.megacredits).to.eq(-1);
    expect(player.production.plants).to.eq(2);

    const input = game.deferredActions.peek()!.execute();
    expect(input).is.undefined;
    expect(player2.production.heat).to.eq(0);
  });

  it('Should play - multiple targets', () => {
    player.production.add(Resource.HEAT, 1);
    player2.production.add(Resource.HEAT, 1);

    card.play(player);
    expect(player.production.megacredits).to.eq(-1);
    expect(player.production.plants).to.eq(2);

    expect(game.deferredActions).has.lengthOf(1);
    const selectPlayer = cast(game.deferredActions.peek()!.execute(), SelectPlayer);
    selectPlayer.cb(player2);
    expect(player2.production.heat).to.eq(0);
  });
});
