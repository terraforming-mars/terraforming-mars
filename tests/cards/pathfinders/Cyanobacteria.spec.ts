import {expect} from 'chai';
import {Cyanobacteria} from '../../../src/server/cards/pathfinders/Cyanobacteria';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {cast, maxOutOceans, runAllActions} from '../../TestingUtils';
import {AndOptions} from '../../../src/server/inputs/AndOptions';
import {GHGProducingBacteria} from '../../../src/server/cards/base/GHGProducingBacteria';
import {Tardigrades} from '../../../src/server/cards/base/Tardigrades';
import {Ants} from '../../../src/server/cards/base/Ants';
import {TileType} from '../../../src/common/TileType';

describe('Cyanobacteria', function() {
  let card: Cyanobacteria;
  let player: TestPlayer;
  let ghgProducingBacteria: GHGProducingBacteria;
  let tardigrades: Tardigrades;
  let ants: Ants;

  beforeEach(function() {
    card = new Cyanobacteria();
    player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player);
    ghgProducingBacteria = new GHGProducingBacteria();
    tardigrades = new Tardigrades();
    ants = new Ants();
    maxOutOceans(player);
  });

  it('play -- the simple part', function() {
    expect(player.game.getOxygenLevel()).eq(0);

    const options = card.play(player);

    expect(player.game.getOxygenLevel()).eq(1);
    expect(options).is.undefined;
  });

  it('play, one microbe card', function() {
    player.playedCards = [ghgProducingBacteria];
    const options = card.play(player);
    expect(options).is.undefined;
    // 9 oceans, so, maxed out.
    runAllActions(player.game);
    expect(ghgProducingBacteria.resourceCount).eq(9);
  });

  it('play, one microbe card, include Wetlands', function() {
    player.playedCards = [ghgProducingBacteria];
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

  it('play, many microbe cards', function() {
    player.playedCards = [ghgProducingBacteria, tardigrades, ants];

    expect(card.play(player)).is.undefined;

    const options = cast(player.game.deferredActions.peek()!.execute(), AndOptions);

    expect(options.options.length).eq(3);
    options?.options[0].cb(1);
    options?.options[1].cb(3);
    options?.options[2].cb(5);
    options?.cb();

    expect(ghgProducingBacteria.resourceCount).eq(1);
    expect(tardigrades.resourceCount).eq(3);
    expect(ants.resourceCount).eq(5);
  });

  it('play, many microbe cards, wrong input', function() {
    player.playedCards = [ghgProducingBacteria, tardigrades, ants];

    card.play(player);
    const options = cast(player.game.deferredActions.peek()!.execute(), AndOptions);
    expect(options?.options.length).eq(3);

    options?.options[0].cb(1);
    options?.options[1].cb(3);
    options?.options[2].cb(6);
    expect(() => options?.cb()).to.throw(/Expecting 9 .*, got 10/);

    options?.options[2].cb(4);
    expect(() => options?.cb()).to.throw(/Expecting 9 .*, got 8/);
  });
});
