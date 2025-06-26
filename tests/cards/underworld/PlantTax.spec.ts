import {expect} from 'chai';
import {PlantTax} from '../../../src/server/cards/underworld/PlantTax';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {cast, finishGeneration, runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('PlantTax', () => {
  let card: PlantTax;
  let player: TestPlayer;
  let player2: TestPlayer;
  let player3: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new PlantTax();
    [game, player, player2, player3] = testGame(3);
  });

  it('play', () => {
    player.plants = 5;
    player2.plants = 15;
    player3.plants = 400;

    cast(card.play(player), undefined);

    runAllActions(game);

    expect(player.plants).eq(3);
    expect(player2.plants).eq(13);
    expect(player3.plants).eq(398);
  });

  it('generationEnd', () => {
    card.play(player);
    player.playedCards.push(card);

    expect(player.underworldData.corruption).eq(0);
    finishGeneration(game);
    expect(player.underworldData.corruption).eq(1);
    finishGeneration(game);
    expect(player.underworldData.corruption).eq(1);
  });
});
