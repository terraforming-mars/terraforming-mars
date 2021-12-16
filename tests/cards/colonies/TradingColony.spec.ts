import {expect} from 'chai';
import {TradingColony} from '../../../src/cards/colonies/TradingColony';
import {Callisto} from '../../../src/colonies/Callisto';
import {Ceres} from '../../../src/colonies/Ceres';
import {Miranda} from '../../../src/colonies/Miranda';
import {Game} from '../../../src/Game';
import {SelectColony} from '../../../src/inputs/SelectColony';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('TradingColony', function() {
  let card : TradingColony; let player : Player; let player2: Player; let game: Game;

  beforeEach(function() {
    card = new TradingColony();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();

    const gameOptions = TestingUtils.setCustomGameOptions({coloniesExtension: true});
    game = Game.newInstance('foobar', [player, player2], player, gameOptions);
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
