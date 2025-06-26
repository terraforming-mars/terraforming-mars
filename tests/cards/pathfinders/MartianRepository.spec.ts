import {expect} from 'chai';
import {MartianRepository} from '../../../src/server/cards/pathfinders/MartianRepository';
import {TestPlayer} from '../../TestPlayer';
import {Units} from '../../../src/common/Units';
import {Tag} from '../../../src/common/cards/Tag';
import {fakeCard, testGame} from '../../TestingUtils';

describe('MartianRepository', () => {
  let card: MartianRepository;
  let player: TestPlayer;

  beforeEach(() => {
    card = new MartianRepository();
    [/* game */, player] = testGame(1);
  });

  it('can play', () => {
    expect(card.canPlay(player)).is.false;
    player.production.override({energy: 1});
    expect(card.canPlay(player)).is.true;
  });

  it('play', () => {
    player.production.override({energy: 1});
    card.play(player);
    expect(player.production.asUnits()).deep.eq(Units.EMPTY);
  });

  it('effect', () => {
    card.onCardPlayed(player, fakeCard({tags: [Tag.VENUS]}));
    expect(card.resourceCount).eq(0);
    card.onCardPlayed(player, fakeCard({tags: [Tag.EARTH]}));
    expect(card.resourceCount).eq(0);
    card.onCardPlayed(player, fakeCard({tags: [Tag.MARS]}));
    expect(card.resourceCount).eq(1);
    card.onCardPlayed(player, fakeCard({tags: [Tag.SCIENCE]}));
    expect(card.resourceCount).eq(2);

    // Should increment twice. ("For every science or Mars tag")
    card.onCardPlayed(player, fakeCard({tags: [Tag.MARS, Tag.SCIENCE]}));
    expect(card.resourceCount).eq(4);

    // Should increment twice. ("For every science or Mars tag")
    card.onCardPlayed(player, fakeCard({tags: [Tag.SCIENCE, Tag.SCIENCE]}));
    expect(card.resourceCount).eq(6);
  });


  it('victoryPoints', () => {
    card.resourceCount = 2;
    expect(card.getVictoryPoints(player)).eq(0);
    card.resourceCount = 3;
    expect(card.getVictoryPoints(player)).eq(1);
    card.resourceCount = 4;
    expect(card.getVictoryPoints(player)).eq(1);
    card.resourceCount = 5;
    expect(card.getVictoryPoints(player)).eq(1);
    card.resourceCount = 6;
    expect(card.getVictoryPoints(player)).eq(2);
  });
});
