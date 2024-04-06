import {expect} from 'chai';
import {ThinkTank} from '../../../src/server/cards/pathfinders/ThinkTank';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {addOcean, runAllActions, setOxygenLevel, setTemperature} from '../../TestingUtils';
import {ArchaeBacteria} from '../../../src/server/cards/base/ArchaeBacteria';
import {Bushes} from '../../../src/server/cards/base/Bushes';
import {BreathingFilters} from '../../../src/server/cards/base/BreathingFilters';
import {OceanCity} from '../../../src/server/cards/ares/OceanCity';
import {Resource} from '../../../src/common/Resource';
import {range} from '../../../src/common/utils/utils';
import {Payment} from '../../../src/common/inputs/Payment';

describe('ThinkTank', () => {
  let thinkTank: ThinkTank;
  let player: TestPlayer;
  let game: Game;

  beforeEach(() => {
    thinkTank = new ThinkTank();
    [game, player] = testGame(1);
    player.playedCards.push(thinkTank);
  });

  it('action', () => {
    player.megaCredits = 1;
    expect(thinkTank.canAct(player)).is.false;

    player.megaCredits = 2;
    expect(thinkTank.canAct(player)).is.true;

    thinkTank.resourceCount = 0;

    thinkTank.action(player);

    runAllActions(game);

    expect(player.megaCredits).eq(0);
    expect(thinkTank.resourceCount).eq(1);
  });

  it('canPlay, positive', () => {
    // Temperature must be -10 or more.
    const bushes = new Bushes();

    setTemperature(game, -10);
    expect(bushes.canPlay(player)).is.true;

    setTemperature(game, -12);
    expect(bushes.canPlay(player)).is.false;

    thinkTank.resourceCount = 1;
    expect(bushes.canPlay(player)).is.true;
    expect(thinkTank.distance(bushes, player)).deep.eq(1);

    setTemperature(game, -14);
    expect(bushes.canPlay(player)).is.false;

    thinkTank.resourceCount = 2;
    expect(bushes.canPlay(player)).is.true;
    expect(thinkTank.distance(bushes, player)).deep.eq(2);
  });

  it('canPlay, negative', () => {
    // Temperature must be -18 or colder.
    const archaeBacteria = new ArchaeBacteria();

    setTemperature(game, -18);
    expect(archaeBacteria.canPlay(player)).is.true;

    setTemperature(game, -16);
    expect(archaeBacteria.canPlay(player)).is.false;

    thinkTank.resourceCount = 1;
    expect(archaeBacteria.canPlay(player)).is.true;

    setTemperature(game, -14);
    expect(archaeBacteria.canPlay(player)).is.false;

    thinkTank.resourceCount = 2;
    expect(archaeBacteria.canPlay(player)).is.true;
  });

  it('Resources get removed', () => {
    // Breathing filters requires 7% oxygen
    const breathingFilters = new BreathingFilters();

    setOxygenLevel(game, 5);
    expect(breathingFilters.canPlay(player)).is.false;

    thinkTank.resourceCount = 4;
    expect(breathingFilters.canPlay(player)).is.true;

    player.megaCredits += breathingFilters.cost;
    player.checkPaymentAndPlayCard(breathingFilters, Payment.of({megaCredits: breathingFilters.cost}));
    runAllActions(game);
    expect(thinkTank.resourceCount).eq(2);
  });

  // Effect on Ocean City when no oceans exist.
  it('Ocean City', () => {
    // The purpose of this test is to confirm that projects that place tiles on ocean spaces
    // are not considered playable if Think Tank has enough data such that the requirement is
    // met even with no oceans on the board.
    const oceanCity = new OceanCity();
    player.production.add(Resource.ENERGY, 1);
    // Requires six oceans
    const [ocean, ...oceans] = range(6).map(() => addOcean(player));

    expect(game.board.getOceanSpaces()).has.length(6);
    expect(oceanCity.canPlay(player)).is.true;

    oceans.forEach((space) => game.removeTile(space.id));

    expect(game.board.getOceanSpaces()).has.length(1);
    expect(oceanCity.canPlay(player)).is.false;

    thinkTank.resourceCount = 5;

    expect(thinkTank.distance(oceanCity, player)).deep.eq(5);

    game.removeTile(ocean.id);
    expect(game.board.getOceanSpaces()).is.empty;

    expect(oceanCity.canPlay(player)).is.false;

    thinkTank.resourceCount = 6;

    expect(oceanCity.canPlay(player)).is.false;
  });
});
