import {expect} from 'chai';
import {UndergroundResearchCenter} from '../../../src/server/cards/underworld/UndergroundResearchCenter';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {CardName} from '../../../src/common/cards/CardName';
import {Tag} from '../../../src/common/cards/Tag';
import {BiomassCombustors} from '../../../src/server/cards/base/BiomassCombustors';
import {UnderworldExpansion} from '../../../src/server/underworld/UnderworldExpansion';
import {assertIsExcavationAction} from '../../underworld/underworldAssertions';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {ColonizerTrainingCamp} from '../../../src/server/cards/base/ColonizerTrainingCamp';
import {SearchForLife} from '../../../src/server/cards/base/SearchForLife';
import {ViralEnhancers} from '../../../src/server/cards/base/ViralEnhancers';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';

describe('UndergroundResearchCenter', () => {
  const canPlayRuns = [
    {excavationMarkers: 4, energyProduction: 0, expected: false},
    {excavationMarkers: 5, energyProduction: 0, expected: false},
    {excavationMarkers: 4, energyProduction: 1, expected: false},
    {excavationMarkers: 5, energyProduction: 1, expected: true},
  ] as const;
  for (const run of canPlayRuns) {
    it('canPlay ' + JSON.stringify(run), () => {
      const card = new UndergroundResearchCenter();
      const [/* game */, player/* , opponent */] = testGame(2, {underworldExpansion: true});

      player.production.override({energy: run.energyProduction});
      const spaces = UnderworldExpansion.excavatableSpaces(player);
      for (let idx = 0; idx < run.excavationMarkers; idx++) {
        spaces[idx].excavator = player;
      }
      expect(card.canPlay(player)).eq(run.expected);
    });
  }

  it('play', () => {
    const card = new UndergroundResearchCenter();
    const [game, player] = testGame(2, {underworldExpansion: true});
    player.production.override({energy: 1});
    assertIsExcavationAction(player, card.play(player));
    runAllActions(game);
    const options = cast(player.popWaitingFor(), OrOptions);
    expect(options.options[0].title).eq(Tag.BUILDING);
    expect(player.cardsInHand).is.empty;

    const scienceCard = new SearchForLife();
    const buildingCard1 = new BiomassCombustors();
    const buildingCard2 = new ColonizerTrainingCamp();
    game.projectDeck.drawPile.push(buildingCard1, scienceCard, buildingCard2);
    game.projectDeck.discardPile = [];

    options.options[0].cb();

    expect(player.cardsInHand.map((c) => c.name)).has.members([CardName.BIOMASS_COMBUSTORS, CardName.COLONIZER_TRAINING_CAMP]);
    expect(game.projectDeck.discardPile.map((c) => c.name)).deep.eq([CardName.SEARCH_FOR_LIFE]);

    expect(player.production.energy).eq(0);
  });

  it('Edge case: no energy production, and Viral Enhancers', () => {
    const card = new UndergroundResearchCenter();
    const [game, player] = testGame(2, {underworldExpansion: true});

    player.playedCards.push(new ViralEnhancers());
    UnderworldExpansion.excavatableSpaces(player)
      .slice(0, 5)
      .forEach((space) => space.excavator = player);

    expect(card.canPlay(player)).is.false;

    const spaces = UnderworldExpansion.excavatableSpaces(player);
    spaces[0].undergroundResources = 'energy1production';
    spaces[1].undergroundResources = 'energy1production';

    expect(card.canPlay(player)).is.true;

    const selectSpace = cast(card.play(player), SelectSpace);
    expect(selectSpace.spaces).to.have.members([spaces[0], spaces[1]]);
    selectSpace.cb(spaces[0]);

    runAllActions(game);
    const options = cast(player.popWaitingFor(), OrOptions);
    expect(options.options[0].title).eq(Tag.BUILDING);
    expect(player.cardsInHand).is.empty;

    options.options[0].cb();

    expect(player.cardsInHand).has.length(2);
    expect(player.production.energy).eq(0);
  });
});
