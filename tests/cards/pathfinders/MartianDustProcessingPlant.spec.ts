import {expect} from 'chai';
import {MartianDustProcessingPlant} from '../../../src/server/cards/pathfinders/MartianDustProcessingPlant';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {Units} from '../../../src/common/Units';

describe('MartianDustProcessingPlant', function() {
  let card: MartianDustProcessingPlant;
  let player: TestPlayer;

  beforeEach(function() {
    card = new MartianDustProcessingPlant();
    [/* game */, player] = testGame(1);
  });

  it('canPlay', function() {
    player.production.override({energy: 0});
    expect(card.canPlay(player)).is.false;
    player.production.override({energy: 1});
    expect(card.canPlay(player)).is.true;
  });

  it('play', function() {
    player.production.override({energy: 1});
    expect(player.getTerraformRating()).eq(14);

    card.play(player);

    expect(player.production.asUnits()).deep.eq(Units.of({steel: 2}));
    expect(player.getTerraformRating()).eq(15);
  });
});
