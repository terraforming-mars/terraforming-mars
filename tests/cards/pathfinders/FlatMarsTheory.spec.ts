import {expect} from 'chai';
import {FlatMarsTheory} from '../../../src/server/cards/pathfinders/FlatMarsTheory';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {Units} from '../../../src/common/Units';
import {testGame} from '../../TestingUtils';

describe('FlatMarsTheory', function() {
  let card: FlatMarsTheory;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new FlatMarsTheory();
    [game, player] = testGame(1);
  });

  it('canPlay', function() {
    player.tagsForTest = {};
    expect(card.canPlay(player)).is.true;

    player.tagsForTest = {science: 1};
    expect(card.canPlay(player)).is.true;

    player.tagsForTest = {science: 2};
    expect(card.canPlay(player)).is.false;

    player.tagsForTest = {science: 1, wild: 1};
    expect(card.canPlay(player)).is.true;

    player.tagsForTest = {wild: 2};
    expect(card.canPlay(player)).is.true;
  });

  it('play', function() {
    (game as any).generation = 4;
    card.play(player);
    expect(player.production.asUnits()).deep.eq(Units.of({megacredits: 4}));

    player.production.override(Units.EMPTY);
    (game as any).generation = 7;
    card.play(player);
    expect(player.production.asUnits()).deep.eq(Units.of({megacredits: 7}));
  });
});
