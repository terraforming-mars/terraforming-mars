import {expect} from 'chai';
import {MartianRepository} from '../../../src/server/cards/pathfinders/MartianRepository';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {Units} from '../../../src/common/Units';
import {IProjectCard} from '../../../src/server/cards/IProjectCard';
import {Tag} from '../../../src/common/cards/Tag';

describe('MartianRepository', function() {
  let card: MartianRepository;
  let player: TestPlayer;

  beforeEach(function() {
    card = new MartianRepository();
    player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player);
  });

  it('can play', function() {
    expect(card.canPlay(player)).is.false;
    player.production.override({energy: 1});
    expect(card.canPlay(player)).is.true;
  });

  it('play', function() {
    player.production.override({energy: 1});
    card.play(player);
    expect(player.production.asUnits()).deep.eq(Units.EMPTY);
  });

  it('effect', function() {
    card.onCardPlayed(player, {tags: [Tag.VENUS]} as IProjectCard);
    expect(card.resourceCount).eq(0);
    card.onCardPlayed(player, {tags: [Tag.EARTH]} as IProjectCard);
    expect(card.resourceCount).eq(0);
    card.onCardPlayed(player, {tags: [Tag.MARS]} as IProjectCard);
    expect(card.resourceCount).eq(1);
    card.onCardPlayed(player, {tags: [Tag.SCIENCE]} as IProjectCard);
    expect(card.resourceCount).eq(2);

    // Should increment twice. ("For every science or Mars tag")
    card.onCardPlayed(player, {tags: [Tag.MARS, Tag.SCIENCE]} as IProjectCard);
    expect(card.resourceCount).eq(4);

    // Should increment twice. ("For every science or Mars tag")
    card.onCardPlayed(player, {tags: [Tag.SCIENCE, Tag.SCIENCE]} as IProjectCard);
    expect(card.resourceCount).eq(6);
  });


  it('victoryPoints', function() {
    card.resourceCount = 2;
    expect(card.getVictoryPoints()).eq(0);
    card.resourceCount = 3;
    expect(card.getVictoryPoints()).eq(1);
    card.resourceCount = 4;
    expect(card.getVictoryPoints()).eq(1);
    card.resourceCount = 5;
    expect(card.getVictoryPoints()).eq(1);
    card.resourceCount = 6;
    expect(card.getVictoryPoints()).eq(2);
  });
});
