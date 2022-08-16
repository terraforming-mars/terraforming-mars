import {expect} from 'chai';
import {TradingColony} from '../../../src/server/cards/colonies/TradingColony';
import {Callisto} from '../../../src/server/colonies/Callisto';
import {Ceres} from '../../../src/server/colonies/Ceres';
import {Miranda} from '../../../src/server/colonies/Miranda';
import {Game} from '../../../src/server/Game';
import {SelectColony} from '../../../src/server/inputs/SelectColony';
import {Player} from '../../../src/server/Player';
import {Resources} from '../../../src/common/Resources';
import {setCustomGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

describe('TradingColony', function() {
  let card: TradingColony;
  let player: Player;
  let player2: Player;
  let game: Game;

  beforeEach(function() {
    card = new TradingColony();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();

    const gameOptions = setCustomGameOptions({coloniesExtension: true});
    game = Game.newInstance('gameid', [player, player2], player, gameOptions);
    game.colonies = [new Callisto(), new Ceres(), new Miranda()];
  });

  it('Should play', function() {
    card.play(player);
    expect(game.deferredActions).has.length(1);

    const selectColony = game.deferredActions.pop()!.execute() as SelectColony;
    selectColony.cb(selectColony.colonies[0]);
    expect(player.getProduction(Resources.ENERGY)).to.eq(1);
    expect(player.colonyTradeOffset).to.eq(1);
  });

  it('Can play if there are available colony tiles to build on', function() {
    game.colonies[0].colonies.push(player.id);
    expect(card.canPlay(player)).is.true;
  });

  it('Cannot play if there are no available colony tiles to build on', function() {
    game.colonies[0].colonies.push(player.id);
    game.colonies[1].colonies.push(player.id);
    expect(card.canPlay(player)).is.false;
  });
});
