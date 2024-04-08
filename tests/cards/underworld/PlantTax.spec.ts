import {expect} from 'chai';
import {PlantTax} from '../../../src/server/cards/underworld/PlantTax';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {finishGeneration, runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('PlantTax', function() {
  let card: PlantTax;
  let player: TestPlayer;
  let player2: TestPlayer;
  let player3: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new PlantTax();
    [game, player, player2, player3] = testGame(3);
  });

  it('play', function() {
    player.plants = 5;
    player2.plants = 15;
    player3.plants = 400;

    expect(card.play(player)).is.undefined;

    runAllActions(game);

    expect(player.plants).eq(3);
    expect(player2.plants).eq(13);
    expect(player3.plants).eq(398);
  });

  it('generationEnd', function() {
    card.play(player);
    player.playedCards.push(card);

    expect(player.underworldData.corruption).eq(0);
    finishGeneration(game);
    expect(player.underworldData.corruption).eq(1);
    finishGeneration(game);
    expect(player.underworldData.corruption).eq(1);
  });
});
