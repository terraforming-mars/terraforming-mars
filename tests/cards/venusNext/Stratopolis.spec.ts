import {expect} from 'chai';
import {Research} from '../../../src/server/cards/base/Research';
import {AerialMappers} from '../../../src/server/cards/venusNext/AerialMappers';
import {Stratopolis} from '../../../src/server/cards/venusNext/Stratopolis';
import {Game} from '../../../src/server/Game';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {cast, churnAction, runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

describe('Stratopolis', function() {
  let card: Stratopolis;
  let player: TestPlayer;

  beforeEach(function() {
    card = new Stratopolis();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player, {venusNextExtension: true});
  });

  it('Can not play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(new Research());
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.production.megacredits).to.eq(2);
  });

  it('Should act - single target', function() {
    player.playedCards.push(card);
    card.action(player);
    runAllActions(player.game);
    expect(card.resourceCount).to.eq(2);
  });

  it('Should act - multiple targets', function() {
    const card2 = new AerialMappers();
    player.playedCards.push(card, card2);

    const selectCard = cast(churnAction(card, player), SelectCard);
    selectCard.cb([card2]);

    expect(card2.resourceCount).to.eq(2);
  });
});
