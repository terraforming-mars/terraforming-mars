import {expect} from 'chai';
import {CometAiming} from '../../../src/server/cards/promo/CometAiming';
import {RotatorImpacts} from '../../../src/server/cards/venusNext/RotatorImpacts';
import {testGame} from '../../TestGame';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TestPlayer} from '../../TestPlayer';
import {cast, maxOutOceans, runAllActions} from '../../TestingUtils';
import {IGame} from '../../../src/server/IGame';

describe('CometAiming', () => {
  let card: CometAiming;
  let game: IGame;
  let player: TestPlayer;
  let player2: TestPlayer;

  beforeEach(() => {
    card = new CometAiming();
    [game, player, player2] = testGame(2);
  });

  it('Should play', () => {
    cast(card.play(player), undefined);
  });

  it('Can not act', () => {
    player.playedCards.push(card);
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act - single action choice, single target', () => {
    player.playedCards.push(card);
    player.titanium = 1;
    expect(card.canAct(player)).is.true;

    card.action(player);
    expect(player.titanium).to.eq(0);
    expect(card.resourceCount).to.eq(1);

    card.action(player);
    expect(player.game.deferredActions).has.lengthOf(1);
    const selectSpace = cast(player.game.deferredActions.peek()!.execute(), SelectSpace);
    selectSpace.cb(selectSpace.spaces[0]);
    expect(player.getTerraformRating()).to.eq(21);
  });

  it('Should act - multiple action choices, multiple targets', () => {
    const card2 = new RotatorImpacts();
    player.playedCards.push(card, card2);

    player.titanium = 1;
    card.resourceCount = 1;

    const action = cast(card.action(player), OrOptions);
    action.options[1].cb([card2]);
    expect(card2.resourceCount).to.eq(1);
    expect(player.titanium).to.eq(0);
  });

  it('Can spend resource to place ocean if oceans are maxed', () => {
    player.playedCards.push(card);
    card.resourceCount = 1;
    maxOutOceans(player2);

    expect(card.canAct(player)).is.true;
    expect(player.getTerraformRating()).eq(20);

    card.action(player);
    runAllActions(game);

    expect(card.resourceCount).to.eq(0);
    expect(player.getTerraformRating()).eq(20);
  });
});
