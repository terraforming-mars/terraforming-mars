import {expect} from 'chai';
import {MILESTONE_EVALS, AWARD_EVALS, MarsBotMAContext} from '../../src/server/automa/MarsBotMilestoneAwardEval';

function mockContext(overrides: Partial<MarsBotMAContext> = {}): MarsBotMAContext {
  const positions = overrides.allTrackPositions?.() ?? [0, 0, 0, 0, 0, 0, 0];
  return {
    trackPos: (index) => positions[index] ?? 0,
    allTrackPositions: () => positions,
    tr: 20,
    mc: 0,
    cityCount: 0,
    greeneryCount: 0,
    oceanCount: 0,
    tilesOwned: 0,
    tilesAdjacentToOcean: 0,
    tilesOnEdge: 0,
    tilesNotAdjacentToOcean: 0,
    playedCards: {total: 0, green: 0, blue: 0, red: 0, greenOrBlue: 0, withoutTags: 0, costing20Plus: 0, costing10OrLess: 0, withNonNegativeVP: 0, withRequirements: 0},
    destroyedBonusCards: 0,
    temperatureRaises: 0,
    highestTrackPos: Math.max(...positions),
    lowestTrackPos: Math.min(...positions),
    tracksAtOrAbove: (pos) => positions.filter((p) => p >= pos).length,
    largestConnectedTileGroup: 0,
    specialTilesOwned: 0,
    hasVenus: false,
    venusTrackPos: 0,
    floaterCount: 0,
    ...overrides,
  };
}

describe('MarsBotMilestoneAwardEval', () => {
  describe('Milestones', () => {
    it('Terraformer: tr >= 35 returns true', () => {
      const ctx = mockContext({tr: 35});
      expect(MILESTONE_EVALS.get('Terraformer')!(ctx)).to.be.true;
    });

    it('Terraformer: tr < 35 returns false', () => {
      const ctx = mockContext({tr: 34});
      expect(MILESTONE_EVALS.get('Terraformer')!(ctx)).to.be.false;
    });

    it('Mayor: cityCount >= 3 returns true', () => {
      const ctx = mockContext({cityCount: 3});
      expect(MILESTONE_EVALS.get('Mayor')!(ctx)).to.be.true;
    });

    it('Mayor: cityCount < 3 returns false', () => {
      const ctx = mockContext({cityCount: 2});
      expect(MILESTONE_EVALS.get('Mayor')!(ctx)).to.be.false;
    });

    it('Builder: trackPos(1) >= 8 returns true', () => {
      const ctx = mockContext({allTrackPositions: () => [8, 0, 0, 0, 0, 0, 0]});
      expect(MILESTONE_EVALS.get('Builder')!(ctx)).to.be.true;
    });

    it('Builder: trackPos(1) < 8 returns false', () => {
      const ctx = mockContext({allTrackPositions: () => [7, 0, 0, 0, 0, 0, 0]});
      expect(MILESTONE_EVALS.get('Builder')!(ctx)).to.be.false;
    });

    it('Planner: all tracks >= 4 returns true', () => {
      const ctx = mockContext({allTrackPositions: () => [4, 4, 4, 4, 4, 4, 4]});
      expect(MILESTONE_EVALS.get('Planner')!(ctx)).to.be.true;
    });

    it('Planner: one track < 4 returns false', () => {
      const ctx = mockContext({allTrackPositions: () => [4, 4, 3, 4, 4, 4, 4]});
      expect(MILESTONE_EVALS.get('Planner')!(ctx)).to.be.false;
    });

    it('Diversifier (Hellas): all tracks >= 3 returns true', () => {
      const ctx = mockContext({allTrackPositions: () => [3, 3, 3, 3, 3, 3, 3]});
      expect(MILESTONE_EVALS.get('Diversifier')!(ctx)).to.be.true;
    });

    it('Diversifier (Hellas): one track < 3 without Venus fails', () => {
      const ctx = mockContext({allTrackPositions: () => [3, 3, 2, 3, 3, 3, 3]});
      expect(MILESTONE_EVALS.get('Diversifier')!(ctx)).to.be.false;
    });

    it('Diversifier (Hellas): one track < 3 with Venus passes (7 of 8)', () => {
      const ctx = mockContext({
        allTrackPositions: () => [3, 3, 3, 3, 3, 3, 3],
        hasVenus: true,
        venusTrackPos: 2,
      });
      // 7 of 8 at 3+ — needs 7, passes
      expect(MILESTONE_EVALS.get('Diversifier')!(ctx)).to.be.true;
    });

    it('Diversifier (Hellas): two tracks < 3 with Venus fails', () => {
      const ctx = mockContext({
        allTrackPositions: () => [3, 3, 2, 3, 3, 3, 3],
        hasVenus: true,
        venusTrackPos: 2,
      });
      // 6 of 8 at 3+ — needs 7, fails
      expect(MILESTONE_EVALS.get('Diversifier')!(ctx)).to.be.false;
    });

    it('Hoverlord: 7+ floaters returns true', () => {
      const ctx = mockContext({floaterCount: 7});
      expect(MILESTONE_EVALS.get('Hoverlord')!(ctx)).to.be.true;
    });

    it('Hoverlord: 6 floaters returns false', () => {
      const ctx = mockContext({floaterCount: 6});
      expect(MILESTONE_EVALS.get('Hoverlord')!(ctx)).to.be.false;
    });

    it('Tactician4 (modular): mc >= 30 returns true', () => {
      const ctx = mockContext({mc: 30});
      expect(MILESTONE_EVALS.get('Tactician4')!(ctx)).to.be.true;
    });

    it('Tactician4 (modular): mc < 30 returns false', () => {
      const ctx = mockContext({mc: 29});
      expect(MILESTONE_EVALS.get('Tactician4')!(ctx)).to.be.false;
    });

    it('Specialist (Elysium): one track at 10+ returns true', () => {
      const ctx = mockContext({allTrackPositions: () => [0, 0, 0, 10, 0, 0, 0]});
      expect(MILESTONE_EVALS.get('Specialist')!(ctx)).to.be.true;
    });

    it('Specialist (Elysium): no track at 10+ returns false', () => {
      const ctx = mockContext({allTrackPositions: () => [9, 9, 9, 9, 9, 9, 9]});
      expect(MILESTONE_EVALS.get('Specialist')!(ctx)).to.be.false;
    });

    it('Specialist (Elysium): Venus track at 10+ returns true', () => {
      const ctx = mockContext({
        allTrackPositions: () => [0, 0, 0, 0, 0, 0, 0],
        hasVenus: true,
        venusTrackPos: 10,
      });
      expect(MILESTONE_EVALS.get('Specialist')!(ctx)).to.be.true;
    });

    it('Briber: mc >= 20 returns true', () => {
      const ctx = mockContext({mc: 20});
      expect(MILESTONE_EVALS.get('Briber')!(ctx)).to.be.true;
    });

    it('Briber: mc < 20 returns false', () => {
      const ctx = mockContext({mc: 19});
      expect(MILESTONE_EVALS.get('Briber')!(ctx)).to.be.false;
    });

    it('Builder7: trackPos(1) >= 7 returns true', () => {
      const ctx = mockContext({allTrackPositions: () => [7, 0, 0, 0, 0, 0, 0]});
      expect(MILESTONE_EVALS.get('Builder7')!(ctx)).to.be.true;
    });

    it('Builder7: trackPos(1) < 7 returns false', () => {
      const ctx = mockContext({allTrackPositions: () => [6, 0, 0, 0, 0, 0, 0]});
      expect(MILESTONE_EVALS.get('Builder7')!(ctx)).to.be.false;
    });

    it('Terraformer29: always returns false (not supported)', () => {
      const ctx = mockContext({tr: 100});
      expect(MILESTONE_EVALS.get('Terraformer29')!(ctx)).to.be.false;
    });

    it('Producer: any 3 tracks combined >= 16 returns true', () => {
      const ctx = mockContext({allTrackPositions: () => [6, 5, 5, 0, 0, 0, 0]});
      expect(MILESTONE_EVALS.get('Producer')!(ctx)).to.be.true;
    });

    it('Producer: top 3 tracks combined < 16 returns false', () => {
      const ctx = mockContext({allTrackPositions: () => [5, 5, 5, 0, 0, 0, 0]});
      expect(MILESTONE_EVALS.get('Producer')!(ctx)).to.be.false;
    });
  });

  describe('Awards', () => {
    it('Landlord: returns tilesOwned', () => {
      const ctx = mockContext({tilesOwned: 7});
      expect(AWARD_EVALS.get('Landlord')!(ctx)).to.eq(7);
    });

    it('Banker: returns trackPos(1) + trackPos(3)', () => {
      const ctx = mockContext({allTrackPositions: () => [4, 0, 3, 0, 0, 0, 0]});
      expect(AWARD_EVALS.get('Banker')!(ctx)).to.eq(7);
    });

    it('Scientist: returns trackPos(4)', () => {
      const ctx = mockContext({allTrackPositions: () => [0, 0, 0, 6, 0, 0, 0]});
      expect(AWARD_EVALS.get('Scientist')!(ctx)).to.eq(6);
    });

    it('Thermalist: returns trackPos(5) + 5', () => {
      const ctx = mockContext({allTrackPositions: () => [0, 0, 0, 0, 3, 0, 0]});
      expect(AWARD_EVALS.get('Thermalist')!(ctx)).to.eq(8);
    });

    it('Mogul: returns highestTrackPos * 2', () => {
      const ctx = mockContext({highestTrackPos: 8});
      expect(AWARD_EVALS.get('Mogul')!(ctx)).to.eq(16);
    });

    it('Collector: returns tracksAtOrAbove(3)', () => {
      const positions = [3, 1, 5, 0, 3, 2, 4];
      const ctx = mockContext({
        allTrackPositions: () => positions,
        tracksAtOrAbove: (pos: number) => positions.filter((p) => p >= pos).length,
      });
      expect(AWARD_EVALS.get('Collector')!(ctx)).to.eq(4); // positions 3, 5, 3, 4 are >= 3
    });

    it('Politician: always returns 5', () => {
      const ctx = mockContext();
      expect(AWARD_EVALS.get('Politician')!(ctx)).to.eq(5);
    });

    it('Benefactor: returns max(0, tr - 15)', () => {
      const ctx = mockContext({tr: 25});
      expect(AWARD_EVALS.get('Benefactor')!(ctx)).to.eq(10);
    });

    it('Benefactor: returns 0 when tr <= 15', () => {
      const ctx = mockContext({tr: 15});
      expect(AWARD_EVALS.get('Benefactor')!(ctx)).to.eq(0);
    });

    it('Excentric: returns floor(mc / 5)', () => {
      const ctx = mockContext({mc: 17});
      expect(AWARD_EVALS.get('Excentric')!(ctx)).to.eq(3);
    });

    it('Forecaster: returns floor(mc / 7)', () => {
      const ctx = mockContext({mc: 20});
      expect(AWARD_EVALS.get('Forecaster')!(ctx)).to.eq(2);
    });
  });

  describe('Venus Awards', () => {
    it('Venuphile: returns Venus track position', () => {
      const ctx = mockContext({venusTrackPos: 5});
      expect(AWARD_EVALS.get('Venuphile')!(ctx)).to.eq(5);
    });

    it('Venuphile: returns 0 when Venus track at 0', () => {
      const ctx = mockContext({venusTrackPos: 0});
      expect(AWARD_EVALS.get('Venuphile')!(ctx)).to.eq(0);
    });
  });
});
