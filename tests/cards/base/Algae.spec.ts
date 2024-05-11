import {expect} from 'chai';
import {Algae} from '../../../src/server/cards/base/Algae';
import {IGame} from '../../../src/server/IGame';
import {TileType} from '../../../src/common/TileType';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('Algae', function() {
  let card: Algae;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new Algae();
    [game, player] = testGame(2);
  });

  it('Can not play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    const oceanSpaces = game.board.getAvailableSpacesForOcean(player);
    for (let i = 0; i < 5; i++) {
      oceanSpaces[i].tile = {tileType: TileType.OCEAN};
    }

    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.plants).to.eq(1);
    expect(player.production.plants).to.eq(2);
  });
});
