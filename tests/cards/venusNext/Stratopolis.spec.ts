import {expect} from 'chai';
import {Research} from '../../../src/cards/base/Research';
import {AerialMappers} from '../../../src/cards/venusNext/AerialMappers';
import {Stratopolis} from '../../../src/cards/venusNext/Stratopolis';
import {Game} from '../../../src/Game';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {setCustomGameOptions, TestPlayers} from '../../TestingUtils';

describe('Stratopolis', function() {
  let card : Stratopolis; let player : Player; let game : Game;

  beforeEach(function() {
    card = new Stratopolis();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const gameOptions = setCustomGameOptions();
    game = Game.newInstance('foobar', [player, redPlayer], player, gameOptions);
  });

  it('Can\'t play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(new Research());
    expect(card.canPlay(player)).is.true;

    card.play(player, game);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
  });

  it('Should act - single target', function() {
    player.playedCards.push(card);
    card.action(player, game);
    expect(player.getResourcesOnCard(card)).to.eq(2);
  });

  it('Should act - multiple targets', function() {
    const card2 = new AerialMappers();
    player.playedCards.push(card, card2);

    const action = card.action(player, game);
    expect(action instanceof SelectCard).is.true;
        action!.cb([card2]);
        expect(player.getResourcesOnCard(card2)).to.eq(2);
  });
});
