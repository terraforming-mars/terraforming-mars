import {expect} from 'chai';
import {ExportConvoy} from '../../../src/server/cards/underworld/ExportConvoy';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {Tardigrades} from '../../../src/server/cards/base/Tardigrades';
import {Birds} from '../../../src/server/cards/base/Birds';

describe('ExportConvoy', () => {
  const canPlayRuns = [
    {plants: 3, microbes: 0, animals: 0, expected: false},
    {plants: 4, microbes: 0, animals: 0, expected: true},
    {plants: 0, microbes: 2, animals: 0, expected: false},
    {plants: 0, microbes: 3, animals: 0, expected: true},
    {plants: 0, microbes: 0, animals: 1, expected: false},
    {plants: 0, microbes: 0, animals: 2, expected: true},
  ] as const;
  for (const run of canPlayRuns) {
    it('canPlay ' + JSON.stringify(run), () => {
      const card = new ExportConvoy();
      const [/* game */, player] = testGame(1, {underworldExpansion: true});
      const tardigrades = new Tardigrades();
      const birds = new Birds();
      player.playedCards.push(tardigrades, birds);

      player.plants = run.plants;
      tardigrades.resourceCount = run.microbes;
      birds.resourceCount = run.animals;

      expect(card.canPlay(player)).eq(run.expected);
    });
  }

  it('play, plants', () => {
    const card = new ExportConvoy();
    const [/* game */, player] = testGame(2, {underworldExpansion: true});
    player.plants = 4;

    cast(card.play(player), undefined);

    expect(player.plants).eq(0);
    expect(player.underworldData.corruption).eq(1);
    expect(player.megaCredits).eq(20);
  });


  it('play, microbes', () => {
    const card = new ExportConvoy();
    const [game, player] = testGame(2, {underworldExpansion: true});
    const tardigrades = new Tardigrades();
    player.playedCards.push(tardigrades);
    tardigrades.resourceCount = 3;

    cast(card.play(player), undefined);
    runAllActions(game);

    expect(tardigrades.resourceCount).eq(0);
    expect(player.underworldData.corruption).eq(1);
    expect(player.megaCredits).eq(20);
  });


  it('play, animals', () => {
    const card = new ExportConvoy();
    const [game, player] = testGame(2, {underworldExpansion: true});
    const birds = new Birds();
    player.playedCards.push(birds);
    birds.resourceCount = 2;

    cast(card.play(player), undefined);
    runAllActions(game);

    expect(birds.resourceCount).eq(0);
    expect(player.underworldData.corruption).eq(1);
    expect(player.megaCredits).eq(20);
  });
});
