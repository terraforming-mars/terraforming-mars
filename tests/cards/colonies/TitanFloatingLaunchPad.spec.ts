import {expect} from 'chai';
import {JupiterFloatingStation} from '../../../src/cards/colonies/JupiterFloatingStation';
import {TitanFloatingLaunchPad} from '../../../src/cards/colonies/TitanFloatingLaunchPad';
import {ICard} from '../../../src/cards/ICard';
import {Luna} from '../../../src/colonies/Luna';
import {Triton} from '../../../src/colonies/Triton';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {SelectColony} from '../../../src/inputs/SelectColony';
import {Player} from '../../../src/Player';
import {AndOptions} from '../../../src/inputs/AndOptions';
import {TestingUtils} from '../../TestingUtils';
import {newTestGame, getTestPlayer} from '../../TestGame';

describe('TitanFloatingLaunchPad', function() {
  let card : TitanFloatingLaunchPad; let player : Player; let game : Game;

  beforeEach(function() {
    card = new TitanFloatingLaunchPad();
    game = newTestGame(2, {coloniesExtension: true});
    player = getTestPlayer(game, 0);
  });

  it('Should act', function() {
    player.playedCards.push(card);
    expect(card.canAct()).is.true;
    expect(card.getVictoryPoints()).to.eq(1);
  });

  it('Should play with single targets', function() {
    player.playedCards.push(card);
    game.colonies = []; // A way to fake out that no colonies are available.

    // No resource and no other card to add to
    card.action(player);
    expect(game.deferredActions).has.lengthOf(1);
    const input = game.deferredActions.peek()!.execute();
    game.deferredActions.pop();
    expect(input).is.undefined;
    expect(card.resourceCount).to.eq(1);

    // No open colonies and no other card to add to
    card.action(player);
    expect(game.deferredActions).has.lengthOf(1);
    const input2 = game.deferredActions.peek()!.execute();
    game.deferredActions.pop();
    expect(input2).is.undefined;
    expect(card.resourceCount).to.eq(2);
  });

  it('Should play with multiple targets', function() {
    const card2 = new JupiterFloatingStation();
    player.playedCards.push(card);
    player.playedCards.push(card2);

    card.action(player);
    expect(game.deferredActions).has.lengthOf(1);
    const selectCard = game.deferredActions.peek()!.execute() as SelectCard<ICard>;
    selectCard.cb([card]);
    expect(card.resourceCount).to.eq(1);
  });

  it('Should play with multiple targets and colonies', function() {
    game.colonies = [new Luna(), new Triton()];

    const card2 = new JupiterFloatingStation();
    player.playedCards.push(card);
    player.playedCards.push(card2);
    player.addResourceTo(card, 7);

    const orOptions = card.action(player) as OrOptions;

    orOptions.options[1].cb(); // Add resource
    expect(game.deferredActions).has.lengthOf(1);
    const selectCard = game.deferredActions.peek()!.execute() as SelectCard<ICard>;
    game.deferredActions.pop();
    selectCard.cb([card]);
    expect(card.resourceCount).to.eq(8);

    orOptions.options[0].cb(); // Trade for free
    expect(game.deferredActions).has.lengthOf(1);
    const selectColony = game.deferredActions.peek()!.execute() as SelectColony;
    selectColony.cb(selectColony.colonies[0]);
    expect(card.resourceCount).to.eq(7);
    expect(player.megaCredits).to.eq(2);
  });


  it('is available through standard trade action', () => {
    const luna = new Luna();
    player.game.colonies = [luna];

    const getTradeAction = () => player.getActions().options.find(
      (option) => option.title === 'Trade with a colony tile');

    expect(getTradeAction()).is.undefined;

    player.playedCards.push(card);

    expect(getTradeAction()).is.undefined;

    card.resourceCount = 1;

    // This is too bad, it's because the action doesn't appear unless one of the standard
    // costs are met. A future change will address that, but for now, let's include this
    // expectation.
    // TODO(kberg): remove this comment and the next two lines when fixing how the trade action
    // works.
    expect(getTradeAction()).is.undefined;
    player.titanium = 3;

    const tradeAction = TestingUtils.cast(getTradeAction(), AndOptions);

    const payAction = TestingUtils.cast(tradeAction.options[0], OrOptions);
    expect(payAction.title).eq('Pay trade fee');
    expect(payAction.options).has.length(2);

    const floaterOption = payAction.options[0];
    expect(floaterOption.title).to.match(/Pay 1 Floater/);

    const mcOption = payAction.options[1];
    expect(mcOption.title).to.match(/Pay 3 Titanium/);

    expect(player.megaCredits).eq(0);

    floaterOption.cb();
    tradeAction.options[1].cb(luna);

    expect(card.resourceCount).eq(0);
    expect(player.megaCredits).eq(2);
  });
});
