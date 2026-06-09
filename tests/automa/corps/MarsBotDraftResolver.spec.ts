import {expect} from 'chai';
import {MarsBotDraftResolver} from '../../../src/server/automa/corps/MarsBotDraftResolver';
import {MarsBotDraftPriority} from '../../../src/server/automa/MarsBotCorpTypes';
import {Tag} from '../../../src/common/cards/Tag';
import {SeededRandom} from '../../../src/common/utils/Random';
import {IProjectCard} from '../../../src/server/cards/IProjectCard';
import {CardType} from '../../../src/common/cards/CardType';
import {CardName} from '../../../src/common/cards/CardName';
import {MarsBotBoard} from '../../../src/server/automa/MarsBotBoard';
import {THARSIS_MARSBOT_BOARD} from '../../../src/server/automa/boards/TharsisMarsBot';

function fakeCard(name: string, tags: Tag[], cost: number = 10): IProjectCard {
  return {
    name: name as CardName,
    tags,
    cost,
    type: CardType.ACTIVE,
  } as unknown as IProjectCard;
}

describe('MarsBotDraftResolver', () => {
  describe('pickCardForMarsBot - tags priority', () => {
    const priority: MarsBotDraftPriority = {type: 'tags', tags: [Tag.BUILDING, Tag.SPACE]};

    it('picks card with matching first-priority tag', () => {
      const rng = new SeededRandom(42);
      const cards = [
        fakeCard('A', [Tag.EARTH]),
        fakeCard('B', [Tag.BUILDING]),
        fakeCard('C', [Tag.PLANT]),
      ];
      const picked = MarsBotDraftResolver.pickCardForMarsBot(cards, priority, rng);
      expect(picked.name).to.eq('B' as CardName);
    });

    it('prefers higher-priority tag', () => {
      const rng = new SeededRandom(42);
      const cards = [
        fakeCard('A', [Tag.SPACE]),     // Second priority, score = 1
        fakeCard('B', [Tag.BUILDING]),  // First priority, score = 2
      ];
      const picked = MarsBotDraftResolver.pickCardForMarsBot(cards, priority, rng);
      expect(picked.name).to.eq('B' as CardName);
    });

    it('multi-tag card scores higher than single-tag', () => {
      const rng = new SeededRandom(42);
      const cards = [
        fakeCard('A', [Tag.BUILDING]),                 // score = 2
        fakeCard('B', [Tag.BUILDING, Tag.SPACE]),      // score = 2 + 1 = 3
      ];
      const picked = MarsBotDraftResolver.pickCardForMarsBot(cards, priority, rng);
      expect(picked.name).to.eq('B' as CardName);
    });

    it('wild tag does NOT match', () => {
      const rng = new SeededRandom(42);
      const cards = [
        fakeCard('A', [Tag.WILD]),
        fakeCard('B', [Tag.BUILDING]),
      ];
      const picked = MarsBotDraftResolver.pickCardForMarsBot(cards, priority, rng);
      expect(picked.name).to.eq('B' as CardName);
    });

    it('no matches picks randomly', () => {
      const rng = new SeededRandom(42);
      const cards = [
        fakeCard('A', [Tag.EARTH]),
        fakeCard('B', [Tag.PLANT]),
      ];
      // Should not throw, just picks one
      const picked = MarsBotDraftResolver.pickCardForMarsBot(cards, priority, rng);
      expect(['A', 'B']).to.include(picked.name);
    });
  });

  describe('pickCardForMarsBot - mostExpensive', () => {
    const priority: MarsBotDraftPriority = {type: 'mostExpensive'};

    it('picks the most expensive card', () => {
      const rng = new SeededRandom(42);
      const cards = [
        fakeCard('A', [], 5),
        fakeCard('B', [], 20),
        fakeCard('C', [], 12),
      ];
      const picked = MarsBotDraftResolver.pickCardForMarsBot(cards, priority, rng);
      expect(picked.name).to.eq('B' as CardName);
    });

    it('ties pick randomly', () => {
      const rng = new SeededRandom(42);
      const cards = [
        fakeCard('A', [], 20),
        fakeCard('B', [], 20),
      ];
      const picked = MarsBotDraftResolver.pickCardForMarsBot(cards, priority, rng);
      expect(['A', 'B']).to.include(picked.name);
    });
  });

  describe('pickCardForMarsBot - leastAdvancedTrack', () => {
    const priority: MarsBotDraftPriority = {type: 'leastAdvancedTrack'};

    it('uses least-advanced track tags to pick', () => {
      const board = new MarsBotBoard(THARSIS_MARSBOT_BOARD);
      const rng = new SeededRandom(42);

      // Advance all tracks except Track 1 (Building/Microbe)
      for (let i = 1; i < board.tracks.length; i++) {
        board.tracks[i].advance();
        board.tracks[i].advance();
      }

      // Track 0 (Building) is least advanced at position 0
      // Its tags are Building and Microbe
      const cards = [
        fakeCard('A', [Tag.EARTH]),
        fakeCard('B', [Tag.BUILDING]),
        fakeCard('C', [Tag.PLANT]),
      ];

      const picked = MarsBotDraftResolver.pickCardForMarsBot(cards, priority, rng, board);
      expect(picked.name).to.eq('B' as CardName);
    });

    it('falls back to random without board', () => {
      const rng = new SeededRandom(42);
      const cards = [
        fakeCard('A', [Tag.EARTH]),
        fakeCard('B', [Tag.BUILDING]),
      ];
      const picked = MarsBotDraftResolver.pickCardForMarsBot(cards, priority, rng);
      expect(['A', 'B']).to.include(picked.name);
    });
  });

  describe('pickCardForMarsBot - mostTags', () => {
    const priority: MarsBotDraftPriority = {type: 'mostTags'};

    it('picks card with most tags', () => {
      const rng = new SeededRandom(42);
      const cards = [
        fakeCard('A', [Tag.EARTH]),
        fakeCard('B', [Tag.BUILDING, Tag.SPACE, Tag.EARTH]),
        fakeCard('C', [Tag.PLANT, Tag.MICROBE]),
      ];
      const picked = MarsBotDraftResolver.pickCardForMarsBot(cards, priority, rng);
      expect(picked.name).to.eq('B' as CardName);
    });

    it('wild tags do not count', () => {
      const rng = new SeededRandom(42);
      const cards = [
        fakeCard('A', [Tag.WILD, Tag.WILD, Tag.WILD]),  // 0 non-wild tags
        fakeCard('B', [Tag.BUILDING, Tag.SPACE]),        // 2 non-wild tags
      ];
      const picked = MarsBotDraftResolver.pickCardForMarsBot(cards, priority, rng);
      expect(picked.name).to.eq('B' as CardName);
    });
  });

  describe('postDraftDiscard', () => {
    const priority: MarsBotDraftPriority = {type: 'tags', tags: [Tag.BUILDING, Tag.SPACE]};

    it('discards non-matching cards from top, stops at first match', () => {
      // Use a fixed seed so shuffle is deterministic
      const rng = new SeededRandom(1);
      const cards = [
        fakeCard('A', [Tag.EARTH]),     // No match
        fakeCard('B', [Tag.PLANT]),     // No match
        fakeCard('C', [Tag.BUILDING]),  // Match
        fakeCard('D', [Tag.EARTH]),     // After match — kept
      ];

      const result = MarsBotDraftResolver.postDraftDiscard(cards, priority, rng);
      // After shuffle, order may vary, but logic should work:
      // Non-matching before first match → discarded, rest → kept
      const totalCards = result.kept.length + result.discarded.length;
      expect(totalCards).to.eq(4);
      // At least the matching card should be kept
      expect(result.kept.some((c) => c.tags.includes(Tag.BUILDING))).to.be.true;
    });

    it('keeps all when none match', () => {
      const rng = new SeededRandom(42);
      const cards = [
        fakeCard('A', [Tag.EARTH]),
        fakeCard('B', [Tag.PLANT]),
        fakeCard('C', [Tag.EARTH]),
        fakeCard('D', [Tag.PLANT]),
      ];

      const result = MarsBotDraftResolver.postDraftDiscard(cards, priority, rng);
      expect(result.kept.length).to.eq(4);
      expect(result.discarded.length).to.eq(0);
    });

    it('keeps all when first card matches', () => {
      // Create cards where at least one has a matching tag
      const rng = new SeededRandom(42);
      const cards = [
        fakeCard('A', [Tag.BUILDING]),
        fakeCard('B', [Tag.BUILDING]),
        fakeCard('C', [Tag.BUILDING]),
        fakeCard('D', [Tag.BUILDING]),
      ];

      const result = MarsBotDraftResolver.postDraftDiscard(cards, priority, rng);
      // All match, so no discard regardless of shuffle order
      expect(result.discarded.length).to.eq(0);
      expect(result.kept.length).to.eq(4);
    });

    it('non-tag priority returns all cards', () => {
      const costPriority: MarsBotDraftPriority = {type: 'mostExpensive'};
      const rng = new SeededRandom(42);
      const cards = [
        fakeCard('A', [Tag.EARTH], 5),
        fakeCard('B', [Tag.PLANT], 10),
      ];

      const result = MarsBotDraftResolver.postDraftDiscard(cards, costPriority, rng);
      expect(result.kept.length).to.eq(2);
      expect(result.discarded.length).to.eq(0);
    });
  });
});
