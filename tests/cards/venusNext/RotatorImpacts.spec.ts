import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {MorningStarInc} from '../../../src/server/cards/venusNext/MorningStarInc';
import {RotatorImpacts} from '../../../src/server/cards/venusNext/RotatorImpacts';
import {MAX_VENUS_SCALE} from '../../../src/common/constants';
import {Game} from '../../../src/server/Game';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';

describe('RotatorImpacts', () => {
  let card: RotatorImpacts;
  let player: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new RotatorImpacts();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Cannot play', () => {
    (game as any).venusScaleLevel = 16;
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Can play', () => {
    (game as any).venusScaleLevel = 14;
    expect(player.canPlayIgnoringCost(card)).is.true;
  });

  it('Should play', () => {
    expect(player.canPlayIgnoringCost(card)).is.true;
    const action = card.play(player);
    expect(action).is.undefined;
  });

  it('Works with MSI corporation', () => {
    const corp = new MorningStarInc();
    corp.play(player);
    player.setCorporationForTest(corp);

    (game as any).venusScaleLevel = 18;
    expect(player.canPlayIgnoringCost(card)).is.true;
  });

  it('Should act', () => {
    player.playedCards.push(card);
    player.megaCredits = 16;
    player.titanium = 2;

    // only one possible action: add resource to card
    expect(card.resourceCount).to.eq(0);
    expect(card.canAct(player)).is.true;

    card.action(player);
    expect(card.resourceCount).to.eq(1);

    // two possible actions: add resource or spend titanium
    const orOptions = cast(card.action(player), OrOptions);
    orOptions.options[0].cb();
    expect(card.resourceCount).to.eq(0);
    expect(game.getVenusScaleLevel()).to.eq(2);
  });

  it('Should not allow to raise Venus level if there no resources on card', () => {
    player.playedCards.push(card);
    player.megaCredits = 5;
    expect(card.canAct(player)).is.not.true;
  });

  it('Should allow to raise Venus level only', () => {
    player.playedCards.push(card);
    card.resourceCount = 1;
    expect(card.canAct(player)).is.true;

    const action = card.action(player);
    expect(action).is.undefined;
    expect(card.resourceCount).to.eq(0);
    expect(game.getVenusScaleLevel()).to.eq(2);
  });

  it('Should not allow to raise Venus level if Venus level is maxed out', () => {
    player.playedCards.push(card);
    card.resourceCount = 1;

    (game as any).venusScaleLevel = MAX_VENUS_SCALE;
    expect(card.canAct(player)).is.not.true;
  });
});
