import {expect} from 'chai';
import {ForestTunnels} from '../../../src/server/cards/underworld/ForestTunnels';
import {testGame} from '../../TestGame';
import {runAllActions} from '../../TestingUtils';
import {SpaceName} from '../../../src/server/SpaceName';

describe('Forest Tunnels', () => {
  it('Can play', () => {
    const card = new ForestTunnels();
    const [game, player] = testGame(1, {underworldExpansion: true});

    expect(card.canPlay(player)).is.false;

    game.board.getSpace(SpaceName.NOCTIS_CITY).excavator = player;

    expect(card.canPlay(player)).is.true;
  });

  it('play', () => {
    const card = new ForestTunnels();
    const [game, player] = testGame(1, {underworldExpansion: true});

    player.stock.plants = 0;
    game.board.getSpace(SpaceName.NOCTIS_CITY).excavator = player;
    card.play(player);
    runAllActions(game);

    expect(player.stock.plants).eq(1);

    player.stock.plants = 0;
    game.board.getSpace(SpaceName.THARSIS_THOLUS).excavator = player;
    card.play(player);
    runAllActions(game);

    expect(player.stock.plants).eq(2);
  });
});
