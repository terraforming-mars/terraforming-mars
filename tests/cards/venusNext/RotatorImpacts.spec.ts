import {expect} from 'chai';
import {MorningStarInc} from '../../../src/cards/venusNext/MorningStarInc';
import {RotatorImpacts} from '../../../src/cards/venusNext/RotatorImpacts';
import {MAX_VENUS_SCALE} from '../../../src/constants';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestingUtils';

describe('RotatorImpacts', function() {
  let card : RotatorImpacts; let player : Player; let game : Game;

  beforeEach(function() {
    card = new RotatorImpacts();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    (game as any).venusScaleLevel = 16;
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    expect(card.canPlay(player)).is.true;
    const action = card.play();
    expect(action).is.undefined;
  });

  it('Works with MSI corporation', function() {
    const corp = new MorningStarInc();
    corp.play();
    player.corporationCard = corp;

    (game as any).venusScaleLevel = 18;
    expect(card.canPlay(player)).is.true;
  });

  it('Should act', function() {
    player.playedCards.push(card);
    player.megaCredits = 16;
    player.titanium = 2;

    // only one possible action: add resource to card
    expect(card.resourceCount).to.eq(0);
    expect(card.canAct(player)).is.true;

    card.action(player);
    expect(card.resourceCount).to.eq(1);

    // two possible actions: add resource or spend titanium
    const orOptions = card.action(player) as OrOptions;
    expect(orOptions instanceof OrOptions).is.true;
    orOptions.options[0].cb();
    expect(card.resourceCount).to.eq(0);
    expect(game.getVenusScaleLevel()).to.eq(2);
  });

  it('Should not allow to raise Venus level if there no resources on card', function() {
    player.playedCards.push(card);
    player.megaCredits = 5;
    expect(card.canAct(player)).is.not.true;
  });

  it('Should allow to raise Venus level only', function() {
    player.playedCards.push(card);
    card.resourceCount = 1;
    expect(card.canAct(player)).is.true;

    const action = card.action(player);
    expect(action).is.undefined;
    expect(card.resourceCount).to.eq(0);
    expect(game.getVenusScaleLevel()).to.eq(2);
  });

  it('Should not allow to raise Venus level if Venus level is maxed out', function() {
    player.playedCards.push(card);
    card.resourceCount = 1;

    (game as any).venusScaleLevel = MAX_VENUS_SCALE;
    expect(card.canAct(player)).is.not.true;
  });
});
