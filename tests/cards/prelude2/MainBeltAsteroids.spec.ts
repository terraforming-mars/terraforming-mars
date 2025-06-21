import {expect} from 'chai';
import {MainBeltAsteroids} from '../../../src/server/cards/prelude2/MainBeltAsteroids';
import {CometAiming} from '../../../src/server/cards/promo/CometAiming';
import {CEOsFavoriteProject} from '../../../src/server/cards/base/CEOsFavoriteProject';
import {testGame} from '../../TestGame';
import {cast, churn, runNextAction} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {IGame} from '../../../src/server/IGame';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {ICard} from '../../../src/server/cards/ICard';

describe('MainBeltAsteroids', () => {
  let card: MainBeltAsteroids;
  let game: IGame;
  let player: TestPlayer;

  beforeEach(() => {
    card = new MainBeltAsteroids();
    [game, player] = testGame(2, {prelude2Expansion: true});
  });

  it('Cannot play', () => {
    player.megaCredits = 4;
    expect(card.canPlay(player)).is.false;
  });

  it('Should play', () => {
    player.megaCredits = 5;
    expect(card.canPlay(player)).is.true;

    player.playCard(card);
    // SelectPaymentDeferred
    runNextAction(game);

    expect(player.megaCredits).to.eq(0);

    player.addResourceTo(card, 5);
    expect(card.resourceCount).to.eq(5);
    expect(player.titanium).to.eq(5);

    expect(card.getVictoryPoints(player)).to.eq(2);
  });

  it('Should act automatically to itself', () => {
    player.megaCredits = 5;

    player.playCard(card);
    // SelectPaymentDeferred
    runNextAction(game);

    expect(card.canAct(player)).is.true;
    expect(card.action(player)).is.undefined;

    runNextAction(game);

    expect(game.deferredActions).has.lengthOf(0);
    expect(card.resourceCount).to.eq(1);
    expect(player.titanium).to.eq(1);

    expect(card.getVictoryPoints(player)).to.eq(0);
  });

  it('Should effect from other sources', () => {
    player.megaCredits = 5;

    player.playCard(card);
    // SelectPaymentDeferred
    runNextAction(game);

    const cometAiming = new CometAiming();
    player.playCard(cometAiming);

    player.titanium = 1;
    const cometChoice = cast(cometAiming.action(player), SelectCard<ICard>);
    cometChoice.cb([card]);

    expect(card.resourceCount).to.eq(1);
    expect(player.titanium).to.eq(1);

    const ceosFavoriteProject = new CEOsFavoriteProject();

    expect(ceosFavoriteProject.canPlay(player));
    player.playCard(ceosFavoriteProject);
    runNextAction(game);

    expect(player.megaCredits).to.eq(0);
    expect(card.resourceCount).to.eq(2);
    expect(player.titanium).to.eq(2);

    expect(card.getVictoryPoints(player)).to.eq(1);
  });

  it('Should act to other cards', () => {
    player.megaCredits = 5;

    player.playCard(card);
    // SelectPaymentDeferred
    runNextAction(game);

    const cometAiming = new CometAiming();
    player.playCard(cometAiming);

    const choice = cast(churn(card.action(player), player), SelectCard);
    choice.cb([cometAiming]);

    expect(card.resourceCount).to.eq(0);
    expect(player.titanium).to.eq(0);
    expect(cometAiming.resourceCount).to.eq(1);
  });
});
