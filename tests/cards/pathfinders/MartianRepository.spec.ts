import {expect} from 'chai';
import {MartianRepository} from '../../../src/cards/pathfinders/MartianRepository';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {TestPlayers} from '../../TestPlayers';
import {Units} from '../../../src/Units';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {Tags} from '../../../src/cards/Tags';

describe('MartianRepository', function() {
  let card: MartianRepository;
  let player: TestPlayer;

  beforeEach(function() {
    card = new MartianRepository();
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player);
  });

  it('can play', function() {
    expect(player.canPlayIgnoringCost(card)).is.false;
    player.setProductionForTest({energy: 1});
    expect(player.canPlayIgnoringCost(card)).is.true;
  });

  it('play', function() {
    player.setProductionForTest({energy: 1});
    card.play(player);
    expect(player.getProductionForTest()).deep.eq(Units.EMPTY);
  });

  it('effect', function() {
    card.onCardPlayed(player, {tags: [Tags.VENUS]} as IProjectCard);
    expect(card.resourceCount).eq(0);
    card.onCardPlayed(player, {tags: [Tags.EARTH]} as IProjectCard);
    expect(card.resourceCount).eq(0);
    card.onCardPlayed(player, {tags: [Tags.MARS]} as IProjectCard);
    expect(card.resourceCount).eq(1);
    card.onCardPlayed(player, {tags: [Tags.SCIENCE]} as IProjectCard);
    expect(card.resourceCount).eq(2);

    // Should increment twice. ("For every science or Mars tag")
    card.onCardPlayed(player, {tags: [Tags.MARS, Tags.SCIENCE]} as IProjectCard);
    expect(card.resourceCount).eq(4);

    // Should increment twice. ("For every science or Mars tag")
    card.onCardPlayed(player, {tags: [Tags.SCIENCE, Tags.SCIENCE]} as IProjectCard);
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
