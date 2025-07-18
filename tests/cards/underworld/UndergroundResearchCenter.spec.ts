import {expect} from 'chai';
import {UndergroundResearchCenter} from '../../../src/server/cards/underworld/UndergroundResearchCenter';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {toName} from '../../../src/common/utils/utils';
import {CardName} from '../../../src/common/cards/CardName';
import {Tag} from '../../../src/common/cards/Tag';
import {assertIsExcavationAction} from '../../underworld/underworldAssertions';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {ColonizerTrainingCamp} from '../../../src/server/cards/base/ColonizerTrainingCamp';
import {SearchForLife} from '../../../src/server/cards/base/SearchForLife';

describe('UndergroundResearchCenter', () => {
  const canPlayRuns = [
    {excavationTokens: 3, expected: false},
    {excavationTokens: 4, expected: true},
  ] as const;
  for (const run of canPlayRuns) {
    it('canPlay ' + JSON.stringify(run), () => {
      const card = new UndergroundResearchCenter();
      const [/* game */, player/* , opponent */] = testGame(2, {underworldExpansion: true});

      for (let idx = 0; idx < run.excavationTokens; idx++) {
        player.underworldData.tokens.push({token: 'nothing', shelter: false, active: false});
      }
      expect(card.canPlay(player)).eq(run.expected);
    });
  }

  it('play', () => {
    const card = new UndergroundResearchCenter();
    const [game, player] = testGame(2, {underworldExpansion: true});

    cast(card.play(player), undefined);
    runAllActions(game);

    assertIsExcavationAction(player, player.popWaitingFor());

    runAllActions(game);

    const options = cast(player.popWaitingFor(), OrOptions);
    expect(options.options[0].title).eq(Tag.BUILDING);
    expect(player.cardsInHand).is.empty;

    const scienceCard = new SearchForLife();
    const buildingCard = new ColonizerTrainingCamp();
    game.projectDeck.drawPile.push(buildingCard, scienceCard);
    game.projectDeck.discardPile = [];

    options.options[0].cb();

    expect(player.cardsInHand.map(toName)).has.members([CardName.COLONIZER_TRAINING_CAMP]);
    expect(game.projectDeck.discardPile.map(toName)).deep.eq([CardName.SEARCH_FOR_LIFE]);

    expect(player.production.energy).eq(0);
  });
});
