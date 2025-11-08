import {expect} from 'chai';
import {PlayedCards} from '../../src/server/cards/PlayedCards';
import {MicroMills} from '../../src/server/cards/base/MicroMills';
import {Comet} from '../../src/server/cards/base/Comet';
import {partialize} from '../../src/common/utils/utils';
import {AICentral} from '../../src/server/cards/base/AICentral';
import {Tag} from '../../src/common/cards/Tag';
import {ColonizerTrainingCamp} from '../../src/server/cards/base/ColonizerTrainingCamp';
import {Kickstarter} from '../../src/server/cards/pathfinders/Kickstarter';

describe('PlayedCards', () => {
  it('Counts events', () => {
    const playedCards = new PlayedCards();
    expect(playedCards.eventCount).eq(0);

    playedCards.push(new MicroMills());
    expect(playedCards.eventCount).eq(0);

    const comet = new Comet();
    playedCards.push(comet);

    expect(playedCards.eventCount).eq(1);

    playedCards.remove(comet);
    expect(playedCards.eventCount).eq(0);
  });

  it('Counts tags, simple', () => {
    const playedCards = new PlayedCards();
    expect(partialize(playedCards.tags)).deep.eq({});

    const aiCentral = new AICentral();
    playedCards.push(aiCentral);
    expect(partialize(playedCards.tags)).deep.eq({
      [Tag.SCIENCE]: 1,
      [Tag.BUILDING]: 1,
    });

    playedCards.remove(aiCentral);
    expect(partialize(playedCards.tags)).deep.eq({});
  });

  it('Counts tags, multiple', () => {
    const playedCards = new PlayedCards();
    playedCards.push(new AICentral());

    expect(partialize(playedCards.tags)).deep.eq({
      [Tag.SCIENCE]: 1,
      [Tag.BUILDING]: 1,
    });

    playedCards.push(new ColonizerTrainingCamp());
    expect(partialize(playedCards.tags)).deep.eq({
      [Tag.SCIENCE]: 1,
      [Tag.JOVIAN]: 1,
      [Tag.BUILDING]: 2,
    });
  });

  it('Counts tags, events', () => {
    const playedCards = new PlayedCards();
    expect(partialize(playedCards.tags)).deep.eq({});

    // Events don't count
    const comet = new Comet();
    playedCards.push(comet);
    expect(partialize(playedCards.tags)).deep.eq({});
    expect(partialize(playedCards.eventTags)).deep.eq({space: 1});
    // Removing the event doesn't change the count.
    playedCards.remove(comet);
    expect(partialize(playedCards.tags)).deep.eq({});
    expect(partialize(playedCards.eventTags)).deep.eq({});
  });

  it('Counts tags, retag', () => {
    const playedCards = new PlayedCards();
    expect(partialize(playedCards.tags)).deep.eq({});

    const kickstarter = new Kickstarter();
    playedCards.push(kickstarter);
    expect(partialize(playedCards.tags)).deep.eq({
      [Tag.CLONE]: 1,
    });

    playedCards.retagCard(kickstarter, () => {
      kickstarter.cloneTag = Tag.CRIME;
    });
    expect(partialize(playedCards.tags)).deep.eq({
      [Tag.CRIME]: 1,
    });
  });
});
