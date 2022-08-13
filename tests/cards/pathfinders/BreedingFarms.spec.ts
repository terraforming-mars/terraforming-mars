import {expect} from 'chai';
import {BreedingFarms} from '../../../src/server/cards/pathfinders/BreedingFarms';
import {Fish} from '../../../src/server/cards/base/Fish';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {runAllActions} from '../../TestingUtils';

describe('BreedingFarms', function() {
  let card: BreedingFarms;
  let player: TestPlayer;
  let fish: Fish;

  beforeEach(function() {
    card = new BreedingFarms();
    player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player);
    player.playedCards.push(card);
    fish = new Fish();
  });

  it('canPlay', function() {
    player.tagsForTest = {};
    expect(player.canPlayIgnoringCost(card)).is.false;

    player.tagsForTest = {science: 1};
    expect(player.canPlayIgnoringCost(card)).is.false;

    player.tagsForTest = {animal: 1};
    expect(player.canPlayIgnoringCost(card)).is.false;

    player.tagsForTest = {science: 1, animal: 1};
    expect(player.canPlayIgnoringCost(card)).is.true;
  });

  it('play', function() {
    expect(player.getTerraformRating()).eq(14);
    expect(player.game.getTemperature()).eq(-30);

    card.play(player);

    expect(player.getTerraformRating()).eq(15);
    expect(player.game.getTemperature()).eq(-28);
  });

  it('Can act', function() {
    player.plants = 0;
    player.playedCards = [];

    expect(card.canAct(player)).is.false;

    player.plants = 1;
    player.playedCards = [];

    expect(card.canAct(player)).is.false;

    player.plants = 0;
    player.playedCards = [fish];

    expect(card.canAct(player)).is.false;

    player.plants = 1;
    player.playedCards = [fish];

    expect(card.canAct(player)).is.true;
  });

  it('act', function() {
    player.plants = 1;
    fish.resourceCount = 0;
    player.playedCards = [fish];

    player.defer(card.action(player));
    runAllActions(player.game);
    player.getWaitingFor()?.cb([fish]);

    expect(player.plants).eq(0);
    expect(fish.resourceCount).eq(1);
  });
});
