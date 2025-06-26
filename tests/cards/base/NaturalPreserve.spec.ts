import {expect} from 'chai';
import {NaturalPreserve} from '../../../src/server/cards/base/NaturalPreserve';
import {IGame} from '../../../src/server/IGame';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TestPlayer} from '../../TestPlayer';
import {TileType} from '../../../src/common/TileType';
import {cast, runAllActions, setOxygenLevel} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('NaturalPreserve', () => {
  let card: NaturalPreserve;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new NaturalPreserve();
    [game, player] = testGame(2);
  });

  it('Cannot play if no spaces available', () => {
    const lands = game.board.getAvailableSpacesOnLand(player);
    for (const land of lands) {
      game.addTile(player, land, {tileType: TileType.NATURAL_PRESERVE});
    }

    expect(card.canPlay(player)).is.not.true;
  });

  it('Cannot play if oxygen level too high', () => {
    setOxygenLevel(game, 5);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can play', () => {
    setOxygenLevel(game, 4);
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', () => {
    expect(card.canPlay(player)).is.true;
    card.play(player);
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectSpace);
    const space = action.spaces[0];
    action.cb(space);
    expect(player.production.megacredits).to.eq(1);
    expect(space.tile?.tileType).to.eq(TileType.NATURAL_PRESERVE);
    expect(space.adjacency?.bonus).eq(undefined);

    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});
