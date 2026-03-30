import {expect} from 'chai';
import {IGame} from '../../src/server/IGame';
import {TestPlayer} from '../TestPlayer';
import {testGame} from '../TestGame';
import {DeltaProjectExpansion} from '../../src/server/delta/DeltaProjectExpansion';
import {DeltaProjectPrelude} from '../../src/server/delta/DeltaProjectPrelude';
import {Tag} from '../../src/common/cards/Tag';
import {cast, fakeCard, runAllActions} from '../TestingUtils';
import {OrOptions} from '../../src/server/inputs/OrOptions';
import {DeltaProjectInput} from '../../src/server/delta/DeltaProjectInput';
import {SelectCard} from '../../src/server/inputs/SelectCard';
import {CardResource} from '../../src/common/CardResource';
import {CardName} from '../../src/common/cards/CardName';
import {SaturnSystems} from '../../src/server/cards/corporation/SaturnSystems';
import {Ringcom} from '../../src/server/cards/pathfinders/Ringcom';
import {SpaceRelay} from '../../src/server/cards/pathfinders/SpaceRelay';
import {RegolithEaters} from '../../src/server/cards/base/RegolithEaters';
import {VictoryPointsBreakdownBuilder} from '../../src/server/game/VictoryPointsBreakdownBuilder';
import {DeltaProjectData} from '../../src/server/delta/DeltaProjectData';
import {Color} from '../../src/common/Color';
import {Game} from '../../src/server/Game';

function progress(data: DeltaProjectData, color: Color) {
  return data.players.get(color)!;
}

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
      progress(data, player.color).position = 9;
      progress(data, player2.color).claimed2VP = true;

      // 2VP (pos 10) is claimed, skip to 5VP (pos 11) → 2 steps
      expect(DeltaProjectExpansion.maxSteps(player)).eq(2);
    });

    it('stops at claimed 5VP spot', () => {
      const data = DeltaProjectExpansion.getData(game);
      for (let i = 1; i <= 9; i++) {
        player.playedCards.push(fakeCard({tags: [Tag.BUILDING, Tag.POWER, Tag.EARTH, Tag.SPACE, Tag.SCIENCE, Tag.PLANT, Tag.MICROBE, Tag.JOVIAN, Tag.ANIMAL]}));
      }
      player.energy = 20;
      progress(data, player.color).position = 9;
      progress(data, player2.color).claimed5VP = true;

      // Can reach 2VP (pos 10) but 5VP is blocked
      expect(DeltaProjectExpansion.maxSteps(player)).eq(1);
    });

    it('returns 0 at end of track', () => {
      const data = DeltaProjectExpansion.getData(game);
      progress(data, player.color).position = 11;
      player.energy = 10;
      expect(DeltaProjectExpansion.maxSteps(player)).eq(0);
    });
  });

  describe('advance', () => {
    it('deducts energy and updates position', () => {
      player.energy = 5;
      const data = DeltaProjectExpansion.getData(game);

      DeltaProjectExpansion.advance(player, 3);

      expect(player.energy).eq(2);
      expect(progress(data, player.color).position).eq(3);
    });

    it('claims 2VP when landing on position 10', () => {
      player.energy = 5;
      const data = DeltaProjectExpansion.getData(game);
      progress(data, player.color).position = 9;

      DeltaProjectExpansion.advance(player, 1);

      expect(progress(data, player.color).claimed2VP).is.true;
    });

    it('claims 5VP and removes 2VP when landing on position 11', () => {
      player.energy = 5;
      const data = DeltaProjectExpansion.getData(game);
      progress(data, player.color).position = 9;
      progress(data, player.color).claimed2VP = true;

      DeltaProjectExpansion.advance(player, 2);

      expect(progress(data, player.color).claimed5VP).is.true;
      expect(progress(data, player.color).claimed2VP).is.false;
    });

    it('does not claim 2VP when skipping past position 10', () => {
      player.energy = 5;
      const data = DeltaProjectExpansion.getData(game);
      progress(data, player.color).position = 9;

      DeltaProjectExpansion.advance(player, 2);

      expect(progress(data, player.color).claimed2VP).is.false;
      expect(progress(data, player.color).claimed5VP).is.true;
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
      progress(data, player.color).position = 1;

      DeltaProjectExpansion.advance(player, 1);
      runAllActions(game);

      const orOptions = cast(player.popWaitingFor(), OrOptions);
      orOptions.options[1].cb();
      expect(player.production.heat).eq(1);
    });

    it('position 3: +2 MC production', () => {
      player.energy = 3;
      const data = DeltaProjectExpansion.getData(game);
      progress(data, player.color).position = 2;

      DeltaProjectExpansion.advance(player, 1);

      expect(player.production.megacredits).eq(2);
    });

    it('position 4: +1 titanium production', () => {
      player.energy = 4;
      const data = DeltaProjectExpansion.getData(game);
      progress(data, player.color).position = 3;

      DeltaProjectExpansion.advance(player, 1);

      expect(player.production.titanium).eq(1);
    });

    it('position 5: draw 4, keep 2', () => {
      player.energy = 5;
      const data = DeltaProjectExpansion.getData(game);
      progress(data, player.color).position = 4;

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
      progress(data, player.color).position = 5;
      player.playedCards.push(
        fakeCard({tags: [Tag.PLANT]}),
        fakeCard({tags: [Tag.PLANT]}),
        fakeCard({tags: [Tag.PLANT]}),
      );

      DeltaProjectExpansion.advance(player, 1);

      expect(player.plants).gte(3);
    });

    it('position 7: reuse a used blue card action', () => {
      player.energy = 7;
      const data = DeltaProjectExpansion.getData(game);
      progress(data, player.color).position = 6;

      const regolith = new RegolithEaters();
      player.playedCards.push(regolith);
      player.actionsThisGeneration.add(CardName.REGOLITH_EATERS);

      DeltaProjectExpansion.advance(player, 1);
      runAllActions(game);

      const selectCard = cast(player.popWaitingFor(), SelectCard);
      expect(selectCard.cards).includes(regolith);
      selectCard.cb([regolith]);
      runAllActions(game);

      expect(regolith.resourceCount).eq(1);
    });

    it('position 7: no action if no used blue cards', () => {
      player.energy = 7;
      const data = DeltaProjectExpansion.getData(game);
      progress(data, player.color).position = 6;

      DeltaProjectExpansion.advance(player, 1);
      runAllActions(game);

      expect(player.popWaitingFor()).is.undefined;
    });

    it('position 8: grants jovian tag', () => {
      player.energy = 8;
      const data = DeltaProjectExpansion.getData(game);
      progress(data, player.color).position = 7;

      const joviansBefore = player.tags.count(Tag.JOVIAN, 'raw');
      DeltaProjectExpansion.advance(player, 1);

      expect(player.tags.extraJovianTags).eq(1);
      expect(player.tags.count(Tag.JOVIAN, 'raw')).eq(joviansBefore + 1);
      expect(progress(data, player.color).jovianBonus).is.true;
    });

    it('position 8: jovian tag not granted twice', () => {
      player.energy = 10;
      const data = DeltaProjectExpansion.getData(game);
      progress(data, player.color).position = 7;
      progress(data, player.color).jovianBonus = true;
      player.tags.extraJovianTags = 1;

      DeltaProjectExpansion.advance(player, 1);

      expect(player.tags.extraJovianTags).eq(1);
    });

    it('position 8: does not grant jovian tag when skipped', () => {
      player.energy = 10;
      const data = DeltaProjectExpansion.getData(game);
      progress(data, player.color).position = 7;

      DeltaProjectExpansion.advance(player, 2);

      expect(player.tags.extraJovianTags).eq(0);
      expect(progress(data, player.color).jovianBonus).is.false;
    });

    it('position 9: add 2 animals to a card', () => {
      player.energy = 9;
      const data = DeltaProjectExpansion.getData(game);
      progress(data, player.color).position = 8;
      const animalCard = fakeCard({resourceType: CardResource.ANIMAL, name: 'AnimalHost' as CardName});
      player.playedCards.push(animalCard);

      DeltaProjectExpansion.advance(player, 1);
      runAllActions(game);

      expect(animalCard.resourceCount).eq(2);
    });

    it('only resolves reward for landing position, not intermediate', () => {
      player.energy = 3;

      DeltaProjectExpansion.advance(player, 3);

      // Position 3 gives +2 MC production; positions 1 and 2 are skipped
      expect(player.production.megacredits).eq(2);
      expect(player.steel).eq(0);
    });
  });

  describe('VP scoring', () => {
    it('awards 2VP for 2VP spot', () => {
      const data = DeltaProjectExpansion.getData(game);
      progress(data, player.color).claimed2VP = true;

      const builder = new VictoryPointsBreakdownBuilder();
      DeltaProjectExpansion.calculateVictoryPoints(player, builder);

      const vp = builder.build();
      expect(vp.victoryPoints).eq(2);
    });

    it('awards 5VP for 5VP spot', () => {
      const data = DeltaProjectExpansion.getData(game);
      progress(data, player.color).claimed5VP = true;

      const builder = new VictoryPointsBreakdownBuilder();
      DeltaProjectExpansion.calculateVictoryPoints(player, builder);

      const vp = builder.build();
      expect(vp.victoryPoints).eq(5);
    });

    it('5VP overrides 2VP (not additive)', () => {
      const data = DeltaProjectExpansion.getData(game);
      progress(data, player.color).claimed5VP = true;

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
      progress(data, player.color).claimed2VP = true;

      player2.energy = 10;
      for (let i = 1; i <= 9; i++) {
        player2.playedCards.push(fakeCard({tags: [Tag.BUILDING, Tag.POWER, Tag.EARTH, Tag.SPACE, Tag.SCIENCE, Tag.PLANT, Tag.MICROBE, Tag.JOVIAN, Tag.ANIMAL]}));
      }
      progress(data, player2.color).position = 9;

      expect(DeltaProjectExpansion.maxSteps(player2)).eq(2);
      expect(progress(data, player2.color).claimed2VP).is.false;
    });

    it('player can overtake 2VP to reach 5VP', () => {
      const data = DeltaProjectExpansion.getData(game);
      progress(data, player.color).claimed2VP = true;
      progress(data, player2.color).position = 9;
      player2.energy = 10;

      for (let i = 1; i <= 9; i++) {
        player2.playedCards.push(fakeCard({tags: [Tag.BUILDING, Tag.POWER, Tag.EARTH, Tag.SPACE, Tag.SCIENCE, Tag.PLANT, Tag.MICROBE, Tag.JOVIAN, Tag.ANIMAL]}));
      }

      DeltaProjectExpansion.advance(player2, 2);

      expect(progress(data, player2.color).position).eq(11);
      expect(progress(data, player2.color).claimed5VP).is.true;
      expect(progress(data, player2.color).claimed2VP).is.false;
    });

    it('2VP spot is freed when holder advances to 5VP', () => {
      const data = DeltaProjectExpansion.getData(game);

      progress(data, player.color).position = 10;
      progress(data, player.color).claimed2VP = true;
      player.energy = 10;
      for (let i = 1; i <= 9; i++) {
        player.playedCards.push(fakeCard({tags: [Tag.BUILDING, Tag.POWER, Tag.EARTH, Tag.SPACE, Tag.SCIENCE, Tag.PLANT, Tag.MICROBE, Tag.JOVIAN, Tag.ANIMAL]}));
      }

      DeltaProjectExpansion.advance(player, 1);

      expect(progress(data, player.color).position).eq(11);
      expect(progress(data, player.color).claimed5VP).is.true;
      expect(progress(data, player.color).claimed2VP).is.false;

      progress(data, player2.color).position = 9;
      player2.energy = 10;
      for (let i = 1; i <= 9; i++) {
        player2.playedCards.push(fakeCard({tags: [Tag.BUILDING, Tag.POWER, Tag.EARTH, Tag.SPACE, Tag.SCIENCE, Tag.PLANT, Tag.MICROBE, Tag.JOVIAN, Tag.ANIMAL]}));
      }

      DeltaProjectExpansion.advance(player2, 1);

      expect(progress(data, player2.color).position).eq(10);
      expect(progress(data, player2.color).claimed2VP).is.true;
    });
  });

  describe('jovian tag card callbacks', () => {
    it('triggers Saturn Systems for the card owner', () => {
      const saturnSystems = new SaturnSystems();
      player.playedCards.push(saturnSystems);

      player.energy = 8;
      const data = DeltaProjectExpansion.getData(game);
      progress(data, player.color).position = 7;

      const mcProdBefore = player.production.megacredits;
      DeltaProjectExpansion.advance(player, 1);

      expect(player.production.megacredits).eq(mcProdBefore + 1);
    });

    it('triggers Saturn Systems for other players', () => {
      const saturnSystems = new SaturnSystems();
      player2.playedCards.push(saturnSystems);

      player.energy = 8;
      const data = DeltaProjectExpansion.getData(game);
      progress(data, player.color).position = 7;

      const mcProdBefore = player2.production.megacredits;
      DeltaProjectExpansion.advance(player, 1);

      expect(player2.production.megacredits).eq(mcProdBefore + 1);
    });

    it('does not trigger Ringcom', () => {
      const ringcom = new Ringcom();
      player2.playedCards.push(ringcom);

      player.energy = 8;
      const data = DeltaProjectExpansion.getData(game);
      progress(data, player.color).position = 7;

      const titaniumBefore = player2.titanium;
      DeltaProjectExpansion.advance(player, 1);

      expect(player2.titanium).eq(titaniumBefore);
    });

    it('does not raise the Pathfinders Jovian track', () => {
      const [pfGame, pfPlayer] = testGame(2, {deltaProjectExpansion: true, pathfindersExpansion: true});
      const pfData = DeltaProjectExpansion.getData(pfGame);
      progress(pfData, pfPlayer.color).position = 7;
      pfPlayer.energy = 8;

      const jovianBefore = pfGame.pathfindersData!.jovian;
      DeltaProjectExpansion.advance(pfPlayer, 1);

      expect(pfGame.pathfindersData!.jovian).eq(jovianBefore);
    });

    it('does not trigger SpaceRelay', () => {
      const spaceRelay = new SpaceRelay();
      player.playedCards.push(spaceRelay);

      player.energy = 8;
      const data = DeltaProjectExpansion.getData(game);
      progress(data, player.color).position = 7;

      const handBefore = player.cardsInHand.length;
      DeltaProjectExpansion.advance(player, 1);

      expect(player.cardsInHand.length).eq(handBefore);
    });
  });

  describe('prelude card', () => {
    it('is added to prelude hand when expansion is enabled', () => {
      expect(player.preludeCardsInHand.some((c) => c.name === CardName.DELTA_PROJECT_PRELUDE)).is.true;
    });

    it('is not present when expansion is disabled', () => {
      const [, p] = testGame(1);
      expect(p.preludeCardsInHand.some((c) => c.name === CardName.DELTA_PROJECT_PRELUDE)).is.false;
    });

    it('canAct returns false with no energy', () => {
      const card = new DeltaProjectPrelude();
      player.energy = 0;
      player.playedCards.push(fakeCard({tags: [Tag.BUILDING]}));
      expect(card.canAct(player)).is.false;
    });

    it('canAct returns false when no tags to advance', () => {
      const card = new DeltaProjectPrelude();
      player.energy = 5;
      expect(card.canAct(player)).is.false;
    });

    it('canAct returns true when can advance', () => {
      const card = new DeltaProjectPrelude();
      player.energy = 5;
      player.playedCards.push(fakeCard({tags: [Tag.BUILDING]}));
      expect(card.canAct(player)).is.true;
    });

    it('action returns DeltaProjectInput with correct range', () => {
      const card = new DeltaProjectPrelude();
      player.energy = 3;
      player.playedCards.push(
        fakeCard({tags: [Tag.BUILDING]}),
        fakeCard({tags: [Tag.POWER]}),
        fakeCard({tags: [Tag.EARTH]}),
      );

      const input = cast(card.action(player), DeltaProjectInput);
      expect(input.min).eq(1);
      expect(input.max).eq(3);
    });

    it('action advances the player on the track', () => {
      const card = new DeltaProjectPrelude();
      player.energy = 3;
      player.playedCards.push(
        fakeCard({tags: [Tag.BUILDING]}),
        fakeCard({tags: [Tag.POWER]}),
        fakeCard({tags: [Tag.EARTH]}),
      );

      const input = cast(card.action(player), DeltaProjectInput);
      input.cb(2);

      const data = DeltaProjectExpansion.getData(game);
      expect(progress(data, player.color).position).eq(2);
      expect(player.energy).eq(1);
    });

    it('once-per-generation via actionsThisGeneration', () => {
      player.energy = 5;
      player.playedCards.push(fakeCard({tags: [Tag.BUILDING]}));

      expect(player.actionsThisGeneration.has(CardName.DELTA_PROJECT_PRELUDE)).is.false;

      player.actionsThisGeneration.add(CardName.DELTA_PROJECT_PRELUDE);

      expect(player.actionsThisGeneration.has(CardName.DELTA_PROJECT_PRELUDE)).is.true;

      player.runProductionPhase();

      expect(player.actionsThisGeneration.has(CardName.DELTA_PROJECT_PRELUDE)).is.false;
    });
  });

  describe('serialization', () => {
    it('round-trips deltaProjectData through serialization', () => {
      const data = DeltaProjectExpansion.getData(game);
      progress(data, player.color).position = 5;
      progress(data, player.color).jovianBonus = true;
      progress(data, player2.color).claimed2VP = true;
      player.tags.extraJovianTags = 1;

      const serialized = game.serialize();
      expect(serialized.deltaProjectData).is.not.undefined;
      expect(serialized.deltaProjectData!.players[player.color]!.position).eq(5);
      expect(serialized.deltaProjectData!.players[player.color]!.jovianBonus).is.true;
      expect(serialized.deltaProjectData!.players[player2.color]!.claimed2VP).is.true;
    });

    it('full deserialization round-trip preserves DeltaProjectData', () => {
      const data = DeltaProjectExpansion.getData(game);
      progress(data, player.color).position = 7;
      progress(data, player.color).jovianBonus = true;
      progress(data, player2.color).position = 10;
      progress(data, player2.color).claimed2VP = true;

      const restored = Game.deserialize(game.serialize());
      const restoredData = DeltaProjectExpansion.getData(restored);

      const p1 = restoredData.players.get(player.color)!;
      expect(p1.position).eq(7);
      expect(p1.jovianBonus).is.true;
      expect(p1.claimed2VP).is.false;
      expect(p1.claimed5VP).is.false;

      const p2 = restoredData.players.get(player2.color)!;
      expect(p2.position).eq(10);
      expect(p2.claimed2VP).is.true;
      expect(p2.claimed5VP).is.false;
      expect(p2.jovianBonus).is.false;
    });
  });
});
