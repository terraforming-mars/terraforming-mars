import {expect} from 'chai';
import {Research} from '../../../src/cards/base/Research';
import {AerialMappers} from '../../../src/cards/venusNext/AerialMappers';
import {Stratopolis} from '../../../src/cards/venusNext/Stratopolis';
import {Game} from '../../../src/Game';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('Stratopolis', function() {
  let card: Stratopolis; let player: Player;

  beforeEach(function() {
    card = new Stratopolis();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const gameOptions = TestingUtils.setCustomGameOptions();
    Game.newInstance('foobar', [player, redPlayer], player, gameOptions);
  });

  it('Can\'t play', function() {
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
    expect(player.getResourcesOnCard(card)).to.eq(2);
  });

  it('Should act - multiple targets', function() {
    const card2 = new AerialMappers();
    player.playedCards.push(card, card2);

    const action = card.action(player);
    expect(action).instanceOf(SelectCard);
        action!.cb([card2]);
        expect(player.getResourcesOnCard(card2)).to.eq(2);
  });
});
