import {expect} from 'chai';
import {Cyanobacteria} from '../../../src/server/cards/pathfinders/Cyanobacteria';
import {TestPlayer} from '../../TestPlayer';
import {cast, maxOutOceans, runAllActions, setOxygenLevel, setTemperature, testGame} from '../../TestingUtils';
import {AndOptions} from '../../../src/server/inputs/AndOptions';
import {GHGProducingBacteria} from '../../../src/server/cards/base/GHGProducingBacteria';
import {Tardigrades} from '../../../src/server/cards/base/Tardigrades';
import {Ants} from '../../../src/server/cards/base/Ants';
import {TileType} from '../../../src/common/TileType';
import {IGame} from '../../../src/server/IGame';
import {OXYGEN_LEVEL_FOR_TEMPERATURE_BONUS, TEMPERATURE_FOR_OCEAN_BONUS} from '../../../src/common/constants';
import {assertPlaceOcean} from '../../assertions';

describe('Cyanobacteria', () => {
  let game: IGame;
  let card: Cyanobacteria;
  let player: TestPlayer;
  let ghgProducingBacteria: GHGProducingBacteria;
  let tardigrades: Tardigrades;
  let ants: Ants;

  beforeEach(() => {
    card = new Cyanobacteria();
    [game, player] = testGame(1);
    ghgProducingBacteria = new GHGProducingBacteria();
    tardigrades = new Tardigrades();
    ants = new Ants();
    maxOutOceans(player, 5);
  });

  it('play -- the simple part', () => {
    expect(player.game.getOxygenLevel()).eq(0);

    cast(card.play(player), undefined);

    expect(player.game.getOxygenLevel()).eq(1);
  });

  it('play, one microbe card', () => {
    player.playedCards.push(ghgProducingBacteria);
    cast(card.play(player), undefined);
    runAllActions(game);
    cast(player.popWaitingFor(), undefined);
    expect(ghgProducingBacteria.resourceCount).eq(5);
  });

  it('play, raising oxygen raises temperature, places ocean, ', () => {
    setOxygenLevel(game, OXYGEN_LEVEL_FOR_TEMPERATURE_BONUS - 1);
    setTemperature(game, TEMPERATURE_FOR_OCEAN_BONUS - 2);
    player.playedCards.push(ghgProducingBacteria);
    cast(card.play(player), undefined);
    runAllActions(game);
    assertPlaceOcean(player, player.popWaitingFor());
    runAllActions(game);
    cast(player.popWaitingFor(), undefined);

    expect(ghgProducingBacteria.resourceCount).eq(6);
  });

  it('play, one microbe card, include Wetlands', () => {
    player.playedCards.push(ghgProducingBacteria);
    player.game.simpleAddTile(
      player,
      player.game.board.getAvailableSpacesOnLand(player)[0],
      {tileType: TileType.WETLANDS});

    cast(card.play(player), undefined);
    runAllActions(game);
    cast(player.popWaitingFor(), undefined);
    // 5 oceans plus wetlands, so 6.
    expect(ghgProducingBacteria.resourceCount).eq(6);
  });

  it('play, many microbe cards', () => {
    player.playedCards.push(ghgProducingBacteria, tardigrades, ants);

    cast(card.play(player), undefined);
    runAllActions(game);
    const options = cast(player.popWaitingFor(), AndOptions);

    expect(options.options).has.length(3);
    options.options[0].cb(1);
    options.options[1].cb(2);
    options.options[2].cb(2);
    options.cb(undefined);

    expect(ghgProducingBacteria.resourceCount).eq(1);
    expect(tardigrades.resourceCount).eq(2);
    expect(ants.resourceCount).eq(2);
  });

  it('play, many microbe cards, wrong input', () => {
    player.playedCards.push(ghgProducingBacteria, tardigrades, ants);

    card.play(player);

    runAllActions(game);
    const options = cast(player.popWaitingFor(), AndOptions);
    expect(options.options).has.length(3);

    options.options[0].cb(1);
    options.options[1].cb(2);
    options.options[2].cb(3);
    expect(() => options.cb(undefined)).to.throw(/Expecting 5 .*, got 6/);

    options.options[2].cb(1);
    expect(() => options.cb(undefined)).to.throw(/Expecting 5 .*, got 4/);
  });
});
