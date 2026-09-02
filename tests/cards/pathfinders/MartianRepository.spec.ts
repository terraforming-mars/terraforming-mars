import {expect} from 'chai';
import {MartianRepository} from '../../../src/server/cards/pathfinders/MartianRepository';
import {TestPlayer} from '../../TestPlayer';
import {Units} from '../../../src/common/Units';
import {Tag} from '../../../src/common/cards/Tag';
import {fakeCard, runAllActions, testGame} from '../../TestingUtils';
import {IGame} from '../../../src/server/IGame';

describe('MartianRepository', () => {
  let card: MartianRepository;
  let game: IGame;
  let player: TestPlayer;

  beforeEach(() => {
    card = new MartianRepository();
    [game, player] = testGame(1, {pathfindersExpansion: true});
  });

  it('can play', () => {
    expect(card.canPlay(player)).is.false;
    player.production.override({energy: 1});
    expect(card.canPlay(player)).is.true;
  });

  it('play', () => {
    player.production.override({energy: 1});
    card.play(player);
    runAllActions(game);
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

  it('canPlay false when Mars track advance would not grant energy production', () => {
    game.pathfindersData!.mars = 0;
    expect(card.canPlay(player)).is.false;
  });

  it('canPlay true when two Mars tags push track through space 8', () => {
    // Two Mars tags advance the track by 2. Starting at 6 lands on 8.
    game.pathfindersData!.mars = 6;
    expect(card.canPlay(player)).is.true;
  });

  it('playing the card nets zero change to energy production', () => {
    game.pathfindersData!.mars = 6;
    player.playCard(card);
    runAllActions(game);
    expect(player.production.energy).eq(0);
  });
});
