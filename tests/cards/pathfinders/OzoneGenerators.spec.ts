import {expect} from 'chai';
import {OzoneGenerators} from '../../../src/server/cards/pathfinders/OzoneGenerators';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('OzoneGenerators', function() {
  let card: OzoneGenerators;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new OzoneGenerators();
    player = TestPlayer.BLUE.newPlayer();
    game = Game.newInstance('gameid', [player], player);
  });

  it('canPlay', function() {
    (game as any).oxygenLevel = 5;
    player.megaCredits = card.cost;
    expect(player.canPlay(card)).is.false;
    (game as any).oxygenLevel = 6;
    expect(player.canPlay(card)).is.true;
  });

  it('canAct', function() {
    player.energy = 2;
    expect(card.canAct(player)).is.false;
    player.energy = 3;
    expect(card.canAct(player)).is.true;
  });

  it('action', function() {
    expect(player.getTerraformRating()).eq(14);
    player.energy = 3;
    card.action(player);
    expect(player.getTerraformRating()).eq(15);
    expect(player.energy).eq(0);
  });
});
