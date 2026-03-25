import {expect} from 'chai';
import {HabitatMarte} from '../../../src/server/cards/pathfinders/HabitatMarte';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {cast, fakeCard, runAllActions} from '../../TestingUtils';
import {Tag} from '../../../src/common/cards/Tag';
import {ValleyTrust} from '../../../src/server/cards/prelude/ValleyTrust';
import {OlympusConference} from '../../../src/server/cards/base/OlympusConference';
import {InterstellarColonyShip} from '../../../src/server/cards/base/InterstellarColonyShip';
import {OumuamuaTypeObjectSurvey} from '../../../src/server/cards/pathfinders/OumuamuaTypeObjectSurvey';
import {SecretLabs} from '../../../src/server/cards/pathfinders/SecretLabs';
import {BreedingFarms} from '../../../src/server/cards/pathfinders/BreedingFarms';
import {PrideoftheEarthArkship} from '../../../src/server/cards/moon/PrideoftheEarthArkship';
import {FlatMarsTheory} from '../../../src/server/cards/pathfinders/FlatMarsTheory';

describe('HabitatMarte', () => {
  let habitatMarte: HabitatMarte;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    habitatMarte = new HabitatMarte();
    [game, player] = testGame(1);
  });

  it('tag count', () => {
    player.playedCards.push(habitatMarte);
    expect(player.tags.count(Tag.SCIENCE, 'raw')).eq(0);
    expect(player.tags.count(Tag.SCIENCE)).eq(1);
  });

  const getCardCostRuns = [
    {cost: 10, includeHabitatMarte: false, tags: [Tag.MARS], expected: 10},
    {cost: 10, includeHabitatMarte: false, tags: [Tag.SCIENCE], expected: 8},
    {cost: 10, includeHabitatMarte: false, tags: [Tag.MARS, Tag.MARS], expected: 10},
    {cost: 10, includeHabitatMarte: true, tags: [Tag.MARS], expected: 8},
    {cost: 10, includeHabitatMarte: true, tags: [Tag.SCIENCE], expected: 8},
    {cost: 10, includeHabitatMarte: true, tags: [Tag.MARS, Tag.MARS], expected: 6},
  ] as const;

  for (const run of getCardCostRuns) {
    it('card cost ' + JSON.stringify(run), () => {
      player.playedCards.push(new ValleyTrust()); // -2 per science tag
      if (run.includeHabitatMarte) {
        player.playedCards.push(habitatMarte);
      }

      const fake = fakeCard({cost: run.cost, tags: [...run.tags]});

      expect(player.getCardCost(fake)).eq(run.expected);
    });
  }

  it('card requirements', () => {
    const fourScienceTags = fakeCard({tags: [Tag.SCIENCE, Tag.SCIENCE, Tag.SCIENCE, Tag.SCIENCE]});
    const oneMarsTag = fakeCard({tags: [Tag.MARS]});
    const fiveMarsTags = fakeCard({tags: [Tag.MARS, Tag.MARS, Tag.MARS, Tag.MARS, Tag.MARS]});

    // Requires five science tags
    const interstellar = new InterstellarColonyShip();
    player.playedCards.push(fourScienceTags);
    player.megaCredits = interstellar.cost;

    expect(player.canPlay(interstellar)).is.false;

    player.playedCards.push(oneMarsTag);

    expect(player.canPlay(interstellar)).is.false;

    player.playedCards.push(habitatMarte);
    expect(player.canPlay(interstellar)).is.true;

    player.playedCards.push(fiveMarsTags);

    expect(player.canPlay(interstellar)).is.true;

    player.playedCards.remove(habitatMarte);

    expect(player.canPlay(interstellar)).is.false;
  });

  it('Olympus Conference', () => {
    player.popWaitingFor();
    const marsCard = fakeCard({tags: [Tag.MARS]});

    // When you play a science tag ... either add a science resource to this card, or remove a science resource from this card to draw a card.
    const olympusConference = new OlympusConference();
    player.playedCards.push(olympusConference);
    expect(olympusConference.resourceCount).eq(0);

    olympusConference.onCardPlayed(player, marsCard);
    runAllActions(game);
    cast(player.getWaitingFor(), undefined);
    expect(olympusConference.resourceCount).eq(0);

    player.playedCards.push(habitatMarte);
    olympusConference.onCardPlayed(player, marsCard);
    runAllActions(game);
    cast(player.getWaitingFor(), undefined);
    expect(olympusConference.resourceCount).eq(1);
  });

  it('Cards with multiple tag requirements', () => {
    // 1 space tag and 1 science tag
    const card1 = new OumuamuaTypeObjectSurvey();
    // 1 science tag and 1 jovian tag
    const card2 = new SecretLabs();
    // 1 science tag and 1 animal tag
    const card3 = new BreedingFarms();
    // 1 science tag and 2 space tags
    const card4 = new PrideoftheEarthArkship();

    // Enough tags for all four cards, except the science.
    // Mars is necessary because tagsForTest overrides all other raw tag counts.
    player.tagsForTest = {jovian: 1, animal: 1, space: 2, mars: 1};

    expect(card1.canPlay(player)).to.be.false;
    expect(card2.canPlay(player)).to.be.false;
    expect(card3.canPlay(player)).to.be.false;
    expect(card4.canPlay(player)).to.be.false;

    player.playedCards.push(habitatMarte);

    expect(card1.canPlay(player)).to.be.true;
    expect(card2.canPlay(player)).to.be.true;
    expect(card3.canPlay(player)).to.be.true;
    expect(card4.canPlay(player)).to.be.true;
  });

  it('Cards with max tag count', () => {
    // 1 science tag max.
    const flatMarsTheory = new FlatMarsTheory();
    player.tagsForTest = {science: 1, mars: 1};

    expect(flatMarsTheory.canPlay(player)).to.be.true;

    player.playedCards.push(habitatMarte);

    expect(flatMarsTheory.canPlay(player)).to.be.false;
  });
});
