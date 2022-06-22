import {expect} from 'chai';
import {SpaceRelay} from '../../../src/cards/pathfinders/SpaceRelay';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {Tags} from '../../../src/common/cards/Tags';
import {Resources} from '../../../src/common/Resources';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {TestPlayers} from '../../TestPlayers';

describe('SpaceRelay', function() {
  let card: SpaceRelay;
  let player: TestPlayer;

  beforeEach(function() {
    card = new SpaceRelay();
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player);
    player.playedCards.push(card);
  });

  it('play', function() {
    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(1);
  });

  it('onCardPlayed', function() {
    card.onCardPlayed(player, {tags: [Tags.VENUS]} as IProjectCard);
    expect(player.cardsInHand).has.length(0);
    card.onCardPlayed(player, {tags: [Tags.JOVIAN]} as IProjectCard);
    expect(player.cardsInHand).has.length(1);
    card.onCardPlayed(player, {tags: [Tags.WILD]} as IProjectCard);
    expect(player.cardsInHand).has.length(1);
  });
});
