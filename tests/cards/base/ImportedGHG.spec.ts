import {expect} from 'chai';
import {ImportedGHG} from '../../../src/server/cards/base/ImportedGHG';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('ImportedGHG', function() {
  it('Should play', function() {
    const card = new ImportedGHG();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.heat).to.eq(1);
    expect(player.heat).to.eq(3);
  });
});
