import {expect} from 'chai';
import {TradingColony} from '../../../src/server/cards/colonies/TradingColony';
import {Callisto} from '../../../src/server/colonies/Callisto';
import {Ceres} from '../../../src/server/colonies/Ceres';
import {Miranda} from '../../../src/server/colonies/Miranda';
import {IGame} from '../../../src/server/IGame';
import {SelectColony} from '../../../src/server/inputs/SelectColony';
import {cast} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestingUtils';

describe('TradingColony', () => {
  let card: TradingColony;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new TradingColony();
    [game, player/* , player2 */] = testGame(2, {coloniesExtension: true});
    game.colonies = [new Callisto(), new Ceres(), new Miranda()];
  });

  it('Should play', () => {
    card.play(player);
    expect(game.deferredActions).has.length(1);

    const selectColony = cast(game.deferredActions.pop()!.execute(), SelectColony);
    selectColony.cb(selectColony.colonies[0]);
    expect(player.production.energy).to.eq(1);
    expect(player.colonies.tradeOffset).to.eq(1);
  });

  it('Can play if there are available colony tiles to build on', () => {
    game.colonies[0].colonies.push(player.id);
    expect(card.canPlay(player)).is.true;
  });

  it('Cannot play if there are no available colony tiles to build on', () => {
    game.colonies[0].colonies.push(player.id);
    game.colonies[1].colonies.push(player.id);
    expect(card.canPlay(player)).is.false;
  });
});
