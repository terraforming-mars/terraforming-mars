import {expect} from 'chai';
import {Research} from '../../../src/cards/base/Research';
import {AerialMappers} from '../../../src/cards/venusNext/AerialMappers';
import {Stratopolis} from '../../../src/cards/venusNext/Stratopolis';
import {Game} from '../../../src/Game';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/common/Resources';
import {setCustomGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

describe('Stratopolis', function() {
  let card: Stratopolis;
  let player: Player;

  beforeEach(function() {
    card = new Stratopolis();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    const gameOptions = setCustomGameOptions();
    Game.newInstance('gameid', [player, redPlayer], player, gameOptions);
  });

  it('Can not play', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(new Research());
    expect(player.canPlayIgnoringCost(card)).is.true;

    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
  });

  it('Should act - single target', function() {
    player.playedCards.push(card);
    card.action(player);
    expect(card.resourceCount).to.eq(2);
  });

  it('Should act - multiple targets', function() {
    const card2 = new AerialMappers();
    player.playedCards.push(card, card2);

    const action = card.action(player);
    expect(action).instanceOf(SelectCard);
        action!.cb([card2]);
        expect(card2.resourceCount).to.eq(2);
  });
});
