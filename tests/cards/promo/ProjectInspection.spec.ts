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
    game = Game.newInstance('foobar', [player], player);
    actionCard = new RestrictedArea();
    player.playedCards.push(actionCard);
  });

  it('Can always play', function() {
    expect(card.canPlay()).is.true;
    expect(card.play(player, game)).is.undefined;
  });

  it('Should play', function() {
    player.setResource(Resources.MEGACREDITS, 2);
    player.setActionsThisGeneration(actionCard.name);
    expect(card.canPlay()).is.true;

    const play = card.play(player, game);
    expect(play instanceof SelectCard).is.true;
  });
});
