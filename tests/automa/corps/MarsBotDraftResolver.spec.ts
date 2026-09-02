import {expect} from 'chai';
import {MarsBotDraftResolver, Shuffler} from '../../../src/server/automa/corps/MarsBotDraftResolver';
import {MarsBotDraftPriority} from '../../../src/server/automa/MarsBotCorpTypes';
import {Tag} from '../../../src/common/cards/Tag';
import {MarsBotBoard} from '../../../src/server/automa/MarsBotBoard';
import {THARSIS_MARSBOT_BOARD} from '../../../src/server/automa/boards/TharsisMarsBot';
import {fakeCard} from '../../TestingUtils';
import {CarbonateProcessing} from '../../../src/server/cards/base/CarbonateProcessing';
import {Asteroid} from '../../../src/server/cards/base/Asteroid';
import {BigAsteroid} from '../../../src/server/cards/base/BigAsteroid';
import {SpaceElevator} from '../../../src/server/cards/base/SpaceElevator';
import {AcquiredCompany} from '../../../src/server/cards/base/AcquiredCompany';
import {Algae} from '../../../src/server/cards/base/Algae';
import {Lichen} from '../../../src/server/cards/base/Lichen';
import {Research} from '../../../src/server/cards/base/Research';
import {OlympusConference} from '../../../src/server/cards/base/OlympusConference';

// Real cards, named for the reason they are in the test.
const buildingCard = new CarbonateProcessing(); // Building, 6 M€
const spaceCard = new Asteroid(); // Space, 14 M€
const buildingAndSpaceCard = new SpaceElevator(); // Space and Building, 27 M€
const expensiveSpaceCard = new BigAsteroid(); // Space, 27 M€
const earthCard = new AcquiredCompany(); // Earth, 10 M€
const plantCard = new Algae(); // Plant, 10 M€
const otherPlantCard = new Lichen(); // Plant, 7 M€
const twoScienceCard = new Research(); // Science and Science, 11 M€
const scienceAndBuildingCard = new OlympusConference(); // Science, Earth and Building, 10 M€

/** Leaves the order alone, so the test sets it by writing the cards in the order it wants. */
const keepOrder: Shuffler = () => {};
/** Reverses the order, to show a choice really does follow the shuffle. */
const reverseOrder: Shuffler = (items) => {
  items.reverse();
};

function resolver(shuffler: Shuffler = keepOrder): MarsBotDraftResolver {
  return new MarsBotDraftResolver(new MarsBotBoard(THARSIS_MARSBOT_BOARD), shuffler);
}

describe('MarsBotDraftResolver', () => {
  describe('pickCard, tags priority', () => {
    const priority: MarsBotDraftPriority = {type: 'tags', tags: [Tag.BUILDING, Tag.SPACE]};

    it('picks the card carrying a priority tag', () => {
      const picked = resolver().pickCard([earthCard, buildingCard, plantCard], priority);

      expect(picked).to.eq(buildingCard);
    });

    it('prefers the tag listed first', () => {
      const picked = resolver().pickCard([spaceCard, buildingCard], priority);

      expect(picked).to.eq(buildingCard);
    });

    it('prefers a card carrying two priority tags to one carrying the first', () => {
      const picked = resolver().pickCard([buildingCard, buildingAndSpaceCard], priority);

      expect(picked).to.eq(buildingAndSpaceCard);
    });

    it('prefers one tag of the first priority to any number of the second', () => {
      // Carbonate Processing carries a single Building tag, Research carries two Science tags.
      const buildingThenScience: MarsBotDraftPriority = {type: 'tags', tags: [Tag.BUILDING, Tag.SCIENCE]};
      const hand = [twoScienceCard, buildingCard];

      expect(resolver(keepOrder).pickCard(hand, buildingThenScience)).to.eq(buildingCard);
      expect(resolver(reverseOrder).pickCard(hand, buildingThenScience)).to.eq(buildingCard);
    });

    it('prefers the first priority tag twice to one of the first and one of the second', () => {
      // Research is Science and Science, Olympus Conference is Science, Earth and Building.
      const scienceThenBuilding: MarsBotDraftPriority = {type: 'tags', tags: [Tag.SCIENCE, Tag.BUILDING]};
      const hand = [scienceAndBuildingCard, twoScienceCard];

      expect(resolver(keepOrder).pickCard(hand, scienceThenBuilding)).to.eq(twoScienceCard);
      expect(resolver(reverseOrder).pickCard(hand, scienceThenBuilding)).to.eq(twoScienceCard);
    });

    it('does not count a wild tag as a match', () => {
      const wildCard = fakeCard({tags: [Tag.WILD]});

      const picked = resolver().pickCard([wildCard, buildingCard], priority);

      expect(picked).to.eq(buildingCard);
    });

    it('treats a hand with no match as one tie across every card', () => {
      const hand = [earthCard, plantCard];

      expect(resolver(keepOrder).pickCard(hand, priority)).to.eq(earthCard);
      expect(resolver(reverseOrder).pickCard(hand, priority)).to.eq(plantCard);
    });

    it('throws on an empty hand', () => {
      expect(() => resolver().pickCard([], priority)).to.throw('Cannot pick from an empty hand');
    });
  });

  describe('pickCard, mostExpensive priority', () => {
    const priority: MarsBotDraftPriority = {type: 'mostExpensive'};

    it('picks the most expensive card', () => {
      const picked = resolver().pickCard([plantCard, expensiveSpaceCard, spaceCard], priority);

      expect(picked).to.eq(expensiveSpaceCard);
    });

    it('breaks a tie on cost with the shuffle, and only between the tied cards', () => {
      // Big Asteroid and Space Elevator both cost 27, Asteroid costs 14 and never wins.
      const hand = [expensiveSpaceCard, buildingAndSpaceCard, spaceCard];

      expect(resolver(keepOrder).pickCard(hand, priority)).to.eq(expensiveSpaceCard);
      expect(resolver(reverseOrder).pickCard(hand, priority)).to.eq(buildingAndSpaceCard);
    });
  });

  describe('pickCard, leastAdvancedTrack priority', () => {
    const priority: MarsBotDraftPriority = {type: 'leastAdvancedTrack'};

    it('drafts for the tags on the least advanced track', () => {
      const marsBotBoard = new MarsBotBoard(THARSIS_MARSBOT_BOARD);
      // Leave track 0 (Building and Microbe) behind, so its tags become the priority.
      for (let i = 1; i < marsBotBoard.tracks.length; i++) {
        marsBotBoard.tracks[i].advance();
      }
      expect(marsBotBoard.definitions[marsBotBoard.getLeastAdvancedTrackIndex()].tags).to.include(Tag.BUILDING);

      const picked = new MarsBotDraftResolver(marsBotBoard, keepOrder)
        .pickCard([earthCard, buildingCard, plantCard], priority);

      expect(picked).to.eq(buildingCard);
    });
  });

  describe('pickCard, mostTags priority', () => {
    const priority: MarsBotDraftPriority = {type: 'mostTags'};

    it('picks the card with the most tags', () => {
      const picked = resolver().pickCard([earthCard, buildingAndSpaceCard, plantCard], priority);

      expect(picked).to.eq(buildingAndSpaceCard);
    });

    it('does not count wild tags', () => {
      const threeWildCard = fakeCard({tags: [Tag.WILD, Tag.WILD, Tag.WILD]});

      const picked = resolver().pickCard([threeWildCard, buildingCard], priority);

      expect(picked).to.eq(buildingCard);
    });
  });

  describe('discardAfterDraft', () => {
    const priority: MarsBotDraftPriority = {type: 'tags', tags: [Tag.BUILDING, Tag.SPACE]};

    it('discards the first card without a priority tag and keeps the rest', () => {
      const drafted = [plantCard, earthCard, buildingCard, otherPlantCard];

      const {kept, discarded} = resolver(keepOrder).discardAfterDraft(drafted, priority);

      expect(discarded).to.deep.eq([plantCard]);
      expect(kept).to.deep.eq([earthCard, buildingCard, otherPlantCard]);
    });

    it('passes over the cards that do carry a priority tag', () => {
      const drafted = [buildingCard, spaceCard, plantCard, earthCard];

      const {kept, discarded} = resolver(keepOrder).discardAfterDraft(drafted, priority);

      expect(discarded).to.deep.eq([plantCard]);
      expect(kept).to.deep.eq([buildingCard, spaceCard, earthCard]);
    });

    it('takes the cards in the shuffled order', () => {
      const drafted = [plantCard, earthCard, buildingCard, otherPlantCard];

      const {kept, discarded} = resolver(reverseOrder).discardAfterDraft(drafted, priority);

      expect(discarded).to.deep.eq([otherPlantCard]);
      expect(kept).to.deep.eq([buildingCard, earthCard, plantCard]);
    });

    it('discards nothing when every card carries a priority tag', () => {
      const drafted = [buildingCard, spaceCard, buildingAndSpaceCard];

      const {kept, discarded} = resolver(keepOrder).discardAfterDraft(drafted, priority);

      expect(discarded).is.empty;
      expect(kept).to.deep.eq(drafted);
    });

    it('discards only the first card when none of them match', () => {
      const drafted = [plantCard, earthCard, otherPlantCard];

      const {kept, discarded} = resolver(keepOrder).discardAfterDraft(drafted, priority);

      expect(discarded).to.deep.eq([plantCard]);
      expect(kept).to.deep.eq([earthCard, otherPlantCard]);
    });

    it('drafting on the least advanced track saves the cards carrying its tags', () => {
      const marsBotBoard = new MarsBotBoard(THARSIS_MARSBOT_BOARD);
      // Leave track 0 (Building and Microbe) behind, so its tags protect the Building card.
      for (let i = 1; i < marsBotBoard.tracks.length; i++) {
        marsBotBoard.tracks[i].advance();
      }
      // The Building card comes first, so a discard that ignored the track would take it.
      const drafted = [buildingCard, plantCard, earthCard];

      const {kept, discarded} = new MarsBotDraftResolver(marsBotBoard, keepOrder)
        .discardAfterDraft(drafted, {type: 'leastAdvancedTrack'});

      expect(discarded).to.deep.eq([plantCard]);
      expect(kept).to.deep.eq([buildingCard, earthCard]);
    });

    it('Credicor saves the most expensive card and discards one of the others', () => {
      // Big Asteroid comes first, so a discard that ignored the cost would take it.
      const drafted = [expensiveSpaceCard, plantCard, spaceCard];

      const {kept, discarded} = resolver(keepOrder).discardAfterDraft(drafted, {type: 'mostExpensive'});

      expect(discarded).to.deep.eq([plantCard]);
      expect(kept).to.deep.eq([expensiveSpaceCard, spaceCard]);
    });

    it('Credicor discards nothing when every drafted card costs the same', () => {
      // Algae and Acquired Company both cost 10 M€.
      const drafted = [plantCard, earthCard];

      const {kept, discarded} = resolver(keepOrder).discardAfterDraft(drafted, {type: 'mostExpensive'});

      expect(discarded).is.empty;
      expect(kept).to.deep.eq(drafted);
    });

    it('Spire saves the card with the most tags and discards one of the others', () => {
      // Space Elevator comes first, so a discard that ignored the tag count would take it.
      const drafted = [buildingAndSpaceCard, buildingCard, earthCard];

      const {kept, discarded} = resolver(keepOrder).discardAfterDraft(drafted, {type: 'mostTags'});

      expect(discarded).to.deep.eq([buildingCard]);
      expect(kept).to.deep.eq([buildingAndSpaceCard, earthCard]);
    });
  });
});
