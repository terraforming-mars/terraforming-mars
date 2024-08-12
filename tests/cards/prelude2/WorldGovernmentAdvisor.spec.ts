import {expect} from 'chai';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {Phase} from '../../../src/common/Phase';
import {WorldGovernmentAdvisor} from '../../../src/server/cards/prelude2/WorldGovernmentAdvisor';
import {IGame} from '../../../src/server/IGame';
import {cast, maxOutOceans, runAllActions, setOxygenLevel, setTemperature} from '../../TestingUtils';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {assertPlaceOcean} from '../../assertions';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TileType} from '../../../src/common/TileType';
import {MAX_OXYGEN_LEVEL, MAX_TEMPERATURE} from '../../../src/common/constants';

describe('WorldGovernmentAdvisor', () => {
  let card: WorldGovernmentAdvisor;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new WorldGovernmentAdvisor();
    [game, player] = testGame(1);
  });

  it('play', () => {
    cast(card.play(player), undefined);
    expect(player.getTerraformRating()).eq(16);
    expect(player.cardsInHand).has.length(1);
  });

  it('action', () => {
    game.phase = Phase.ACTION;
    const orOptions = cast(card.action(player), OrOptions);

    expect(game.phase).eq(Phase.SOLAR);
    expect(orOptions.options[0].title).eq('Increase temperature');
    expect(player.getTerraformRating()).eq(14);

    orOptions.options[0].cb();
    orOptions.cb(undefined);

    runAllActions(game);

    cast(player.popWaitingFor(), undefined);
    expect(game.phase).eq(Phase.ACTION);
    expect(player.getTerraformRating()).eq(14);
    expect(game.getTemperature()).eq(-28);

    // After this player raises temperature and it rewards them.
    game.increaseTemperature(player, 1);
    expect(player.getTerraformRating()).eq(15);
    expect(game.getTemperature()).eq(-26);
  });

  it('action - placing an ocean', () => {
    game.phase = Phase.ACTION;
    const orOptions = cast(card.action(player), OrOptions);

    expect(game.phase).eq(Phase.SOLAR);
    expect(orOptions.options[2].title).eq('Add an ocean');

    const selectSpace = cast(orOptions.options[2], SelectSpace);
    orOptions.cb(undefined);
    assertPlaceOcean(player, selectSpace);

    runAllActions(game);

    cast(player.popWaitingFor(), undefined);
    expect(player.getTerraformRating()).eq(14);
  });

  it('action - placing an ocean', () => {
    const orOptions = cast(card.action(player), OrOptions);

    const oceanSpace = game.board.getAvailableSpacesForOcean(player)[0];
    const adjacentSpace = game.board.getAdjacentSpaces(oceanSpace)[0];
    game.simpleAddTile(player, adjacentSpace, {tileType: TileType.OCEAN});

    const selectSpace = cast(orOptions.options[2], SelectSpace);
    orOptions.cb(undefined);
    selectSpace.cb(oceanSpace);

    runAllActions(game);

    cast(player.popWaitingFor(), undefined);
    expect(player.getTerraformRating()).eq(14);
    expect(player.megaCredits).eq(0);
  });

  it('action - raise temperature to 0', () => {
    const orOptions = cast(card.action(player), OrOptions);

    setTemperature(game, -2);
    orOptions.options[0].cb();
    orOptions.cb(undefined);
    runAllActions(game);

    assertPlaceOcean(player, player.popWaitingFor());

    runAllActions(game);

    cast(player.popWaitingFor(), undefined);
    expect(player.getTerraformRating()).eq(14);
  });

  it('canAct - game is at maximum', () => {
    setTemperature(game, MAX_TEMPERATURE);
    setOxygenLevel(game, MAX_OXYGEN_LEVEL);
    maxOutOceans(player);

    expect(card.canAct(player)).is.true;
    expect(card.warnings.has('marsIsTerraformed')).is.true;
  });

  it('action - game is at maximum', () => {
    setTemperature(game, MAX_TEMPERATURE);
    setOxygenLevel(game, MAX_OXYGEN_LEVEL);
    maxOutOceans(player);

    cast(card.action(player), undefined);
  });
});
