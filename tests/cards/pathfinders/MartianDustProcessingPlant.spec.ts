import {expect} from 'chai';
import {MartianDustProcessingPlant} from '../../../src/cards/pathfinders/MartianDustProcessingPlant';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {Units} from '../../../src/common/Units';

describe('MartianDustProcessingPlant', function() {
  let card: MartianDustProcessingPlant;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new MartianDustProcessingPlant();
    game = newTestGame(1);
    player = getTestPlayer(game, 0);
  });

  it('canPlay', function() {
    player.setProductionForTest({energy: 0});
    expect(player.canPlayIgnoringCost(card)).is.false;
    player.setProductionForTest({energy: 1});
    expect(player.canPlayIgnoringCost(card)).is.true;
  });

  it('play', function() {
    player.setProductionForTest({energy: 1});
    expect(player.getTerraformRating()).eq(14);

    card.play(player);

    expect(player.getProductionForTest()).deep.eq(Units.of({steel: 2}));
    expect(player.getTerraformRating()).eq(15);
  });
});
