import {expect} from 'chai';
import {Research} from '../../../src/server/cards/base/Research';
import {AerialMappers} from '../../../src/server/cards/venusNext/AerialMappers';
import {Stratopolis} from '../../../src/server/cards/venusNext/Stratopolis';
import {Game} from '../../../src/server/Game';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {Player} from '../../../src/server/Player';
import {cast, testGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

describe('Stratopolis', function() {
  let card: Stratopolis;
  let player: Player;

  beforeEach(function() {
    card = new Stratopolis();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player, testGameOptions({venusNextExtension: true}));
  });

  it('Can not play', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(new Research());
    expect(player.canPlayIgnoringCost(card)).is.true;

    card.play(player);
    expect(player.production.megacredits).to.eq(2);
  });

  it('Should act - single target', function() {
    player.playedCards.push(card);
    card.action(player);
    expect(card.resourceCount).to.eq(2);
  });

  it('Should act - multiple targets', function() {
    const card2 = new AerialMappers();
    player.playedCards.push(card, card2);

    const action = cast(card.action(player), SelectCard);
    action.cb([card2]);

    expect(card2.resourceCount).to.eq(2);
  });
});
