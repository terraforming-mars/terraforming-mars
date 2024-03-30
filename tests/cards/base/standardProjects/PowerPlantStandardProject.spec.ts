import {expect} from 'chai';
import {PowerPlantStandardProject} from '../../../../src/server/cards/base/standardProjects/PowerPlantStandardProject';
import {TestPlayer} from '../../../TestPlayer';
import {Game} from '../../../../src/server/Game';
import {StandardTechnology} from '../../../../src/server/cards/base/StandardTechnology';

describe('PowerPlantStandardProjects', function() {
  let card: PowerPlantStandardProject;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new PowerPlantStandardProject();
    player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, player2], player);
  });

  it('Should act', function() {
    player.stock.megacredits = 11;
    player.playedCards.push(new StandardTechnology());
    expect(game.deferredActions.length).eq(0);
    card.action(player);
    expect(game.deferredActions.length).eq(1);
    expect(player.stock.megacredits).eq(11);
    game.deferredActions.runNext();
    expect(player.production.energy).eq(1);
    expect(player.stock.megacredits).eq(3);
  });
});
