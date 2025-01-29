import {expect} from 'chai';
import {cast, setVenusScaleLevel} from '../../TestingUtils';
import {MorningStarInc} from '../../../src/server/cards/venusNext/MorningStarInc';
import {RotatorImpacts} from '../../../src/server/cards/venusNext/RotatorImpacts';
import {MAX_VENUS_SCALE} from '../../../src/common/constants';
import {IGame} from '../../../src/server/IGame';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('RotatorImpacts', () => {
  let card: RotatorImpacts;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new RotatorImpacts();
    [game, player] = testGame(2);
  });

  it('Cannot play', () => {
    setVenusScaleLevel(game, 16);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can play', () => {
    setVenusScaleLevel(game, 14);
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', () => {
    expect(card.canPlay(player)).is.true;
    cast(card.play(player), undefined);
  });

  it('Works with MSI corporation', () => {
    const corp = new MorningStarInc();
    corp.play(player);
    player.corporations.push(corp);

    setVenusScaleLevel(game, 18);
    expect(card.canPlay(player)).is.true;
  });

  it('Should act - only add resource', () => {
    player.playedCards.push(card);
    player.megaCredits = 16;
    player.titanium = 2;

    // only one possible action: add resource to card
    expect(card.resourceCount).to.eq(0);
    expect(card.canAct(player)).is.true;

    card.action(player);
    expect(card.resourceCount).to.eq(1);
  });

  it('Should act - only spend resource', () => {
    player.playedCards.push(card);
    player.megaCredits = 1;
    card.resourceCount = 1;

    expect(card.canAct(player)).is.true;
    expect(game.getVenusScaleLevel()).eq(0);

    // only one possible action: spend resource
    card.action(player);
    expect(card.resourceCount).to.eq(0);
    expect(game.getVenusScaleLevel()).eq(2);
    expect(player.getTerraformRating()).eq(21);
  });

  it('Should act', () => {
    player.playedCards.push(card);
    player.megaCredits = 16;
    player.titanium = 2;
    card.resourceCount = 1;

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
    cast(action, undefined);
    expect(card.resourceCount).to.eq(0);
    expect(game.getVenusScaleLevel()).to.eq(2);
  });

  it('Should not allow to raise Venus level if Venus level is maxed out', () => {
    player.playedCards.push(card);
    card.resourceCount = 1;

    setVenusScaleLevel(game, MAX_VENUS_SCALE);
    expect(card.canAct(player)).is.true;
    expect(Array.from(card.warnings)).contains('maxvenus');
  });
});
