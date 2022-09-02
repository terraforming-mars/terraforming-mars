import {expect} from 'chai';
import {HeatTrappers} from '../../../src/server/cards/base/HeatTrappers';
import {Game} from '../../../src/server/Game';
import {SelectPlayer} from '../../../src/server/inputs/SelectPlayer';
import {TestPlayer} from '../../TestPlayer';
import {Resources} from '../../../src/common/Resources';
import {cast} from '../../TestingUtils';

describe('HeatTrappers', function() {
  let card: HeatTrappers;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new HeatTrappers();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, player2], player);
  });

  it('Should be playable in solo mode', function() {
    game = Game.newInstance('gameid', [player], player);
    player.production.add(Resources.HEAT, 1);

    expect(card.canPlay(player)).is.true;
    card.play(player);

    expect(player.production.heat).to.eq(1); // Not changed
    expect(card.getVictoryPoints()).to.eq(-1);
    expect(player.production.energy).to.eq(1); // Incremented
  });

  it('Should play - auto select if single target', function() {
    player2.production.add(Resources.HEAT, 7);
    expect(card.canPlay(player)).is.true;
    card.play(player);
    expect(player.production.energy).to.eq(1);

    const input = game.deferredActions.peek()!.execute();
    expect(input).is.undefined;
    expect(player2.production.heat).to.eq(5);
  });

  it('Should play - multiple targets', function() {
    player.production.add(Resources.HEAT, 3);
    player2.production.add(Resources.HEAT, 7);
    card.play(player);

    expect(player.production.energy).to.eq(1);

    expect(game.deferredActions).has.lengthOf(1);
    const selectPlayer = cast(game.deferredActions.peek()!.execute(), SelectPlayer);
    selectPlayer.cb(player2);
    expect(player2.production.heat).to.eq(5);
  });

  it('Can not play if nobody has heat production', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Gives victory points', function() {
    expect(card.getVictoryPoints()).to.eq(-1);
  });
});
