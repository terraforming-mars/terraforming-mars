import {expect} from 'chai';
import {IGame} from '../../src/server/IGame';
import {TestPlayer} from '../TestPlayer';
import {testGame} from '../TestGame';
import {DeltaProjectExpansion} from '../../src/server/delta/DeltaProjectExpansion';
import {Tag} from '../../src/common/cards/Tag';
import {cast, fakeCard, runAllActions} from '../TestingUtils';
import {OrOptions} from '../../src/server/inputs/OrOptions';
import {DeltaProjectInput} from '../../src/server/delta/DeltaProjectInput';
import {SelectCard} from '../../src/server/inputs/SelectCard';
import {CardResource} from '../../src/common/CardResource';
import {CardName} from '../../src/common/cards/CardName';
import {Resource} from '../../src/common/Resource';
import {SaturnSystems} from '../../src/server/cards/corporation/SaturnSystems';
import {Ringcom} from '../../src/server/cards/pathfinders/Ringcom';
import {SpaceRelay} from '../../src/server/cards/pathfinders/SpaceRelay';
import {VictoryPointsBreakdownBuilder} from '../../src/server/game/VictoryPointsBreakdownBuilder';

describe('DeltaProjectExpansion', () => {
  let game: IGame;
  let player: TestPlayer;
  let player2: TestPlayer;

  beforeEach(() => {
    [game, player, player2] = testGame(2, {deltaProjectExpansion: true});
  });

  it('initializes player positions to 0', () => {
    expect(DeltaProjectExpansion.getPosition(game, player)).eq(0);
    expect(DeltaProjectExpansion.getPosition(game, player2)).eq(0);
  });

  describe('canAct', () => {
    it('returns false when expansion is not enabled', () => {
      const [, p] = testGame(1);
      expect(DeltaProjectExpansion.canAct(p)).is.false;
    });

    it('returns false when already used this generation', () => {
      player.energy = 5;
      player.playedCards.push(fakeCard({tags: [Tag.BUILDING]}));
      player.deltaProjectActionUsedThisGeneration = true;
      expect(DeltaProjectExpansion.canAct(player)).is.false;
    });

    it('returns false with no energy', () => {
      player.energy = 0;
      player.playedCards.push(fakeCard({tags: [Tag.BUILDING]}));
      expect(DeltaProjectExpansion.canAct(player)).is.false;
    });

    it('returns false when no tags to advance', () => {
      player.energy = 5;
      expect(DeltaProjectExpansion.canAct(player)).is.false;
    });

    it('returns true when can advance at least one step', () => {
      player.energy = 5;
      player.playedCards.push(fakeCard({tags: [Tag.BUILDING]}));
      expect(DeltaProjectExpansion.canAct(player)).is.true;
    });
  });

  describe('maxSteps', () => {
    it('limited by energy', () => {
      player.playedCards.push(
        fakeCard({tags: [Tag.BUILDING]}),
        fakeCard({tags: [Tag.POWER]}),
        fakeCard({tags: [Tag.EARTH]}),
      );
      player.energy = 2;
      expect(DeltaProjectExpansion.maxSteps(player)).eq(2);
    });

    it('limited by tags', () => {
      player.playedCards.push(fakeCard({tags: [Tag.BUILDING]}));
      player.energy = 10;
      expect(DeltaProjectExpansion.maxSteps(player)).eq(1);
    });

    it('requires all prior tags', () => {
      player.playedCards.push(
        fakeCard({tags: [Tag.BUILDING]}),
        fakeCard({tags: [Tag.EARTH]}),
      );
      player.energy = 10;
      // Missing power tag at position 2, so can only reach 1
      expect(DeltaProjectExpansion.maxSteps(player)).eq(1);
    });

    it('wild tags fill missing tags', () => {
      player.playedCards.push(
        fakeCard({tags: [Tag.BUILDING]}),
        fakeCard({tags: [Tag.WILD]}),
        fakeCard({tags: [Tag.EARTH]}),
      );
      player.energy = 10;
      // Wild fills missing power tag → can reach 3
      expect(DeltaProjectExpansion.maxSteps(player)).eq(3);
    });

    it('multiple wilds cover multiple gaps', () => {
      player.playedCards.push(
        fakeCard({tags: [Tag.WILD]}),
        fakeCard({tags: [Tag.WILD]}),
      );
      player.energy = 10;
      // Two wilds cover building + power → can reach 2
      expect(DeltaProjectExpansion.maxSteps(player)).eq(2);
    });

    it('skips claimed 2VP spot', () => {
      const data = DeltaProjectExpansion.getData(game);
      for (let i = 1; i <= 9; i++) {
        player.playedCards.push(fakeCard({tags: [Tag.BUILDING, Tag.POWER, Tag.EARTH, Tag.SPACE, Tag.SCIENCE, Tag.PLANT, Tag.MICROBE, Tag.JOVIAN, Tag.ANIMAL]}));
      }
      player.energy = 20;
      data.playerPositions.set(player.color, 9);
      data.claimed2VP.push(player2.color);

      // 2VP (pos 10) is claimed, skip to 5VP (pos 11) → 2 steps
      expect(DeltaProjectExpansion.maxSteps(player)).eq(2);
    });

    it('stops at claimed 5VP spot', () => {
      const data = DeltaProjectExpansion.getData(game);
      for (let i = 1; i <= 9; i++) {
        player.playedCards.push(fakeCard({tags: [Tag.BUILDING, Tag.POWER, Tag.EARTH, Tag.SPACE, Tag.SCIENCE, Tag.PLANT, Tag.MICROBE, Tag.JOVIAN, Tag.ANIMAL]}));
      }
      player.energy = 20;
      data.playerPositions.set(player.color, 9);
      data.claimed5VP.push(player2.color);

      // Can reach 2VP (pos 10) but 5VP is blocked
      expect(DeltaProjectExpansion.maxSteps(player)).eq(1);
    });

    it('returns 0 at end of track', () => {
      const data = DeltaProjectExpansion.getData(game);
      data.playerPositions.set(player.color, 11);
      player.energy = 10;
      expect(DeltaProjectExpansion.maxSteps(player)).eq(0);
    });
  });

  describe('advance', () => {
    it('deducts energy and updates position', () => {
      player.energy = 5;
      const data = DeltaProjectExpansion.getData(game);
      data.playerPositions.set(player.color, 0);

      DeltaProjectExpansion.advance(player, 3);

      expect(player.energy).eq(2);
      expect(data.playerPositions.get(player.color)).eq(3);
    });

    it('sets once-per-generation flag', () => {
      player.energy = 5;
      expect(player.deltaProjectActionUsedThisGeneration).is.false;

      DeltaProjectExpansion.advance(player, 1);

      expect(player.deltaProjectActionUsedThisGeneration).is.true;
    });

    it('claims 2VP when landing on position 10', () => {
      player.energy = 5;
      const data = DeltaProjectExpansion.getData(game);
      data.playerPositions.set(player.color, 9);

      DeltaProjectExpansion.advance(player, 1);

      expect(data.claimed2VP).includes(player.color);
    });

    it('claims 5VP and removes 2VP when landing on position 11', () => {
      player.energy = 5;
      const data = DeltaProjectExpansion.getData(game);
      data.playerPositions.set(player.color, 9);
      data.claimed2VP.push(player.color);

      DeltaProjectExpansion.advance(player, 2);

      expect(data.claimed5VP).includes(player.color);
      expect(data.claimed2VP).does.not.include(player.color);
    });

    it('does not claim 2VP when skipping past position 10', () => {
      player.energy = 5;
      const data = DeltaProjectExpansion.getData(game);
      data.playerPositions.set(player.color, 9);

      DeltaProjectExpansion.advance(player, 2);

      expect(data.claimed2VP).does.not.include(player.color);
      expect(data.claimed5VP).includes(player.color);
    });
  });

  describe('reward resolution', () => {
    it('position 1: choose 2 steel or 2 plants', () => {
      player.energy = 1;
      DeltaProjectExpansion.advance(player, 1);
      runAllActions(game);

      const orOptions = cast(player.popWaitingFor(), OrOptions);
      orOptions.options[0].cb();
      expect(player.steel).eq(2);
    });

    it('position 2: choose energy or heat production', () => {
      player.energy = 2;
      const data = DeltaProjectExpansion.getData(game);
      data.playerPositions.set(player.color, 1);

      DeltaProjectExpansion.advance(player, 1);
      runAllActions(game);

      const orOptions = cast(player.popWaitingFor(), OrOptions);
      orOptions.options[1].cb();
      expect(player.production.heat).eq(1);
    });

    it('position 3: +2 MC production', () => {
      player.energy = 3;
      const data = DeltaProjectExpansion.getData(game);
      data.playerPositions.set(player.color, 2);

      DeltaProjectExpansion.advance(player, 1);

      expect(player.production.megacredits).eq(2);
    });

    it('position 4: +1 titanium production', () => {
      player.energy = 4;
      const data = DeltaProjectExpansion.getData(game);
      data.playerPositions.set(player.color, 3);

      DeltaProjectExpansion.advance(player, 1);

      expect(player.production.titanium).eq(1);
    });

    it('position 5: draw 4, keep 2', () => {
      player.energy = 5;
      const data = DeltaProjectExpansion.getData(game);
      data.playerPositions.set(player.color, 4);

      DeltaProjectExpansion.advance(player, 1);
      runAllActions(game);

      const selectCard = cast(player.popWaitingFor(), SelectCard);
      expect(selectCard.cards.length).eq(4);
      selectCard.cb([selectCard.cards[0], selectCard.cards[1]]);
      expect(player.cardsInHand.length).eq(2);
    });

    it('position 6: gain plants per plant tag', () => {
      player.energy = 6;
      const data = DeltaProjectExpansion.getData(game);
      data.playerPositions.set(player.color, 5);
      player.playedCards.push(
        fakeCard({tags: [Tag.PLANT]}),
        fakeCard({tags: [Tag.PLANT]}),
        fakeCard({tags: [Tag.PLANT]}),
      );

      DeltaProjectExpansion.advance(player, 1);

      expect(player.plants).gte(3);
    });

    it('position 8: grants jovian tag', () => {
      player.energy = 8;
      const data = DeltaProjectExpansion.getData(game);
      data.playerPositions.set(player.color, 7);

      const joviansBefore = player.tags.count(Tag.JOVIAN, 'raw');
      DeltaProjectExpansion.advance(player, 1);

      expect(player.tags.extraJovianTags).eq(1);
      expect(player.tags.count(Tag.JOVIAN, 'raw')).eq(joviansBefore + 1);
      expect(data.jovianBonus).includes(player.color);
    });

    it('position 8: jovian tag not granted twice', () => {
      player.energy = 10;
      const data = DeltaProjectExpansion.getData(game);
      data.playerPositions.set(player.color, 7);
      data.jovianBonus.push(player.color);
      player.tags.extraJovianTags = 1;

      DeltaProjectExpansion.advance(player, 1);

      expect(player.tags.extraJovianTags).eq(1);
    });

    it('position 8: does not grant jovian tag when skipped', () => {
      player.energy = 10;
      const data = DeltaProjectExpansion.getData(game);
      data.playerPositions.set(player.color, 7);

      DeltaProjectExpansion.advance(player, 2);

      expect(player.tags.extraJovianTags).eq(0);
      expect(data.jovianBonus).does.not.include(player.color);
    });

    it('position 9: add 2 animals to a card', () => {
      player.energy = 9;
      const data = DeltaProjectExpansion.getData(game);
      data.playerPositions.set(player.color, 8);
      const animalCard = fakeCard({resourceType: CardResource.ANIMAL, name: 'AnimalHost' as CardName});
      player.playedCards.push(animalCard);

      DeltaProjectExpansion.advance(player, 1);
      runAllActions(game);

      expect(animalCard.resourceCount).eq(2);
    });

    it('only resolves reward for landing position, not intermediate', () => {
      player.energy = 3;
      const data = DeltaProjectExpansion.getData(game);
      data.playerPositions.set(player.color, 0);

      DeltaProjectExpansion.advance(player, 3);

      // Position 3 gives +2 MC production; positions 1 and 2 are skipped
      expect(player.production.megacredits).eq(2);
      expect(player.steel).eq(0);
    });
  });

  describe('VP scoring', () => {
    it('awards 2VP for 2VP spot', () => {
      const data = DeltaProjectExpansion.getData(game);
      data.claimed2VP.push(player.color);

      const builder = new VictoryPointsBreakdownBuilder();
      DeltaProjectExpansion.calculateVictoryPoints(player, builder);

      const vp = builder.build();
      expect(vp.victoryPoints).eq(2);
    });

    it('awards 5VP for 5VP spot', () => {
      const data = DeltaProjectExpansion.getData(game);
      data.claimed5VP.push(player.color);

      const builder = new VictoryPointsBreakdownBuilder();
      DeltaProjectExpansion.calculateVictoryPoints(player, builder);

      const vp = builder.build();
      expect(vp.victoryPoints).eq(5);
    });

    it('5VP overrides 2VP (not additive)', () => {
      const data = DeltaProjectExpansion.getData(game);
      data.claimed5VP.push(player.color);

      const builder = new VictoryPointsBreakdownBuilder();
      DeltaProjectExpansion.calculateVictoryPoints(player, builder);

      const vp = builder.build();
      expect(vp.victoryPoints).eq(5);
    });

    it('no VP if not on a VP spot', () => {
      const builder = new VictoryPointsBreakdownBuilder();
      DeltaProjectExpansion.calculateVictoryPoints(player, builder);

      const vp = builder.build();
      expect(vp.victoryPoints).eq(0);
    });
  });

  describe('VP spot contention', () => {
    it('only one player can claim 2VP', () => {
      const data = DeltaProjectExpansion.getData(game);
      data.claimed2VP.push(player.color);

      player2.energy = 10;
      for (let i = 1; i <= 9; i++) {
        player2.playedCards.push(fakeCard({tags: [Tag.BUILDING, Tag.POWER, Tag.EARTH, Tag.SPACE, Tag.SCIENCE, Tag.PLANT, Tag.MICROBE, Tag.JOVIAN, Tag.ANIMAL]}));
      }
      data.playerPositions.set(player2.color, 9);

      expect(DeltaProjectExpansion.maxSteps(player2)).eq(2);
      expect(data.claimed2VP).does.not.include(player2.color);
    });

    it('player can overtake 2VP to reach 5VP', () => {
      const data = DeltaProjectExpansion.getData(game);
      data.claimed2VP.push(player.color);
      data.playerPositions.set(player2.color, 9);
      player2.energy = 10;

      for (let i = 1; i <= 9; i++) {
        player2.playedCards.push(fakeCard({tags: [Tag.BUILDING, Tag.POWER, Tag.EARTH, Tag.SPACE, Tag.SCIENCE, Tag.PLANT, Tag.MICROBE, Tag.JOVIAN, Tag.ANIMAL]}));
      }

      DeltaProjectExpansion.advance(player2, 2);

      expect(data.playerPositions.get(player2.color)).eq(11);
      expect(data.claimed5VP).includes(player2.color);
      expect(data.claimed2VP).does.not.include(player2.color);
    });
  });

  describe('jovian tag card callbacks', () => {
    it('triggers Saturn Systems for the card owner', () => {
      const saturnSystems = new SaturnSystems();
      player.playedCards.push(saturnSystems);

      player.energy = 8;
      const data = DeltaProjectExpansion.getData(game);
      data.playerPositions.set(player.color, 7);

      const mcProdBefore = player.production.megacredits;
      DeltaProjectExpansion.advance(player, 1);

      expect(player.production.megacredits).eq(mcProdBefore + 1);
    });

    it('triggers Saturn Systems for other players', () => {
      const saturnSystems = new SaturnSystems();
      player2.playedCards.push(saturnSystems);

      player.energy = 8;
      const data = DeltaProjectExpansion.getData(game);
      data.playerPositions.set(player.color, 7);

      const mcProdBefore = player2.production.megacredits;
      DeltaProjectExpansion.advance(player, 1);

      expect(player2.production.megacredits).eq(mcProdBefore + 1);
    });

    it('triggers Ringcom for other players', () => {
      const ringcom = new Ringcom();
      player2.playedCards.push(ringcom);

      player.energy = 8;
      const data = DeltaProjectExpansion.getData(game);
      data.playerPositions.set(player.color, 7);

      const titaniumBefore = player2.titanium;
      DeltaProjectExpansion.advance(player, 1);

      expect(player2.titanium).eq(titaniumBefore + 1);
    });

    it('triggers SpaceRelay only for the active player', () => {
      const spaceRelay1 = new SpaceRelay();
      player.playedCards.push(spaceRelay1);
      const spaceRelay2 = new SpaceRelay();
      player2.playedCards.push(spaceRelay2);

      player.energy = 8;
      const data = DeltaProjectExpansion.getData(game);
      data.playerPositions.set(player.color, 7);

      const handBefore = player.cardsInHand.length;
      const hand2Before = player2.cardsInHand.length;
      DeltaProjectExpansion.advance(player, 1);

      expect(player.cardsInHand.length).eq(handBefore + 1);
      expect(player2.cardsInHand.length).eq(hand2Before);
    });
  });

  describe('action flow', () => {
    it('returns DeltaProjectInput with correct range', () => {
      player.energy = 3;
      player.playedCards.push(
        fakeCard({tags: [Tag.BUILDING]}),
        fakeCard({tags: [Tag.POWER]}),
        fakeCard({tags: [Tag.EARTH]}),
      );

      const input = cast(DeltaProjectExpansion.action(player), DeltaProjectInput);
      expect(input.min).eq(1);
      expect(input.max).eq(3);
    });

    it('once-per-generation lock resets at production phase', () => {
      player.energy = 5;
      player.playedCards.push(fakeCard({tags: [Tag.BUILDING]}));

      DeltaProjectExpansion.advance(player, 1);
      expect(player.deltaProjectActionUsedThisGeneration).is.true;

      player.runProductionPhase();
      expect(player.deltaProjectActionUsedThisGeneration).is.false;
    });
  });

  describe('serialization', () => {
    it('round-trips deltaProjectData through serialization', () => {
      const data = DeltaProjectExpansion.getData(game);
      data.playerPositions.set(player.color, 5);
      data.claimed2VP.push(player2.color);
      data.jovianBonus.push(player.color);
      player.tags.extraJovianTags = 1;

      const serialized = game.serialize();
      expect(serialized.deltaProjectData).is.not.undefined;
      expect(serialized.deltaProjectData!.playerPositions[player.color]).eq(5);
      expect(serialized.deltaProjectData!.claimed2VP).deep.eq([player2.color]);
      expect(serialized.deltaProjectData!.jovianBonus).deep.eq([player.color]);
    });
  });
});
