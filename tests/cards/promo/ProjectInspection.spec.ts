import {expect} from 'chai';
import {RestrictedArea} from '../../../src/cards/base/RestrictedArea';
import {ProjectInspection} from '../../../src/cards/promo/ProjectInspection';
import {Game} from '../../../src/Game';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestingUtils';

describe('ProjectInspection', function() {
  let card : ProjectInspection; let player : Player; let game : Game; let actionCard: RestrictedArea;

  beforeEach(function() {
    card = new ProjectInspection();
    player = TestPlayers.BLUE.newPlayer();
    game = new Game('foobar', [player], player);
    actionCard = new RestrictedArea();
    player.playedCards.push(actionCard);
  });

  it('Can\'t play if no actions played this turn', function() {
    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Can\'t play if available actions can\'t act', function() {
    player.setActionsThisGeneration(actionCard.name);
    player.megaCredits = 1;

    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Should play', function() {
    player.setResource(Resources.MEGACREDITS, 2);
    player.setActionsThisGeneration(actionCard.name);
    expect(card.canPlay(player, game)).is.true;

    const play = card.play(player, game);
    expect(play instanceof SelectCard).is.true;
  });
});
