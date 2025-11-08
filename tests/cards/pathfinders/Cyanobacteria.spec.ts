import {expect} from 'chai';
import {Cyanobacteria} from '../../../src/server/cards/pathfinders/Cyanobacteria';
import {TestPlayer} from '../../TestPlayer';
import {cast, maxOutOceans, runAllActions, testGame} from '../../TestingUtils';
import {AndOptions} from '../../../src/server/inputs/AndOptions';
import {GHGProducingBacteria} from '../../../src/server/cards/base/GHGProducingBacteria';
import {Tardigrades} from '../../../src/server/cards/base/Tardigrades';
import {Ants} from '../../../src/server/cards/base/Ants';
import {TileType} from '../../../src/common/TileType';

describe('Cyanobacteria', () => {
  let card: Cyanobacteria;
  let player: TestPlayer;
  let ghgProducingBacteria: GHGProducingBacteria;
  let tardigrades: Tardigrades;
  let ants: Ants;

  beforeEach(() => {
    card = new Cyanobacteria();
    [/* game */, player] = testGame(1);
    ghgProducingBacteria = new GHGProducingBacteria();
    tardigrades = new Tardigrades();
    ants = new Ants();
    maxOutOceans(player);
  });

  it('play -- the simple part', () => {
    expect(player.game.getOxygenLevel()).eq(0);

    const options = card.play(player);

    expect(player.game.getOxygenLevel()).eq(1);
    expect(options).is.undefined;
  });

  it('play, one microbe card', () => {
    player.playedCards.push(ghgProducingBacteria);
    const options = card.play(player);
    expect(options).is.undefined;
    // 9 oceans, so, maxed out.
    runAllActions(player.game);
    expect(ghgProducingBacteria.resourceCount).eq(9);
  });

  it('play, one microbe card, include Wetlands', () => {
    player.playedCards.push(ghgProducingBacteria);
    player.game.simpleAddTile(
      player,
      player.game.board.getAvailableSpacesOnLand(player)[0],
      {tileType: TileType.WETLANDS});

    const options = card.play(player);
    expect(options).is.undefined;
    runAllActions(player.game);
    // 9 oceans plus wetlands, so 10.
    expect(ghgProducingBacteria.resourceCount).eq(10);
  });

  it('play, many microbe cards', () => {
    player.playedCards.push(ghgProducingBacteria, tardigrades, ants);

    cast(card.play(player), undefined);

    const options = cast(player.game.deferredActions.peek()!.execute(), AndOptions);

    expect(options.options).has.length(3);
    options?.options[0].cb(1);
    options?.options[1].cb(3);
    options?.options[2].cb(5);
    options?.cb(undefined);

    expect(ghgProducingBacteria.resourceCount).eq(1);
    expect(tardigrades.resourceCount).eq(3);
    expect(ants.resourceCount).eq(5);
  });

  it('play, many microbe cards, wrong input', () => {
    player.playedCards.push(ghgProducingBacteria, tardigrades, ants);

    card.play(player);
    const options = cast(player.game.deferredActions.peek()!.execute(), AndOptions);
    expect(options?.options).has.length(3);

    options?.options[0].cb(1);
    options?.options[1].cb(3);
    options?.options[2].cb(6);
    expect(() => options?.cb(undefined)).to.throw(/Expecting 9 .*, got 10/);

    options?.options[2].cb(4);
    expect(() => options?.cb(undefined)).to.throw(/Expecting 9 .*, got 8/);
  });
});
