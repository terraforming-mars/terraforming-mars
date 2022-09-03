import {expect} from 'chai';
import {JupiterFloatingStation} from '../../../src/server/cards/colonies/JupiterFloatingStation';
import {TitanFloatingLaunchPad} from '../../../src/server/cards/colonies/TitanFloatingLaunchPad';
import {ICard} from '../../../src/server/cards/ICard';
import {Luna} from '../../../src/server/colonies/Luna';
import {Triton} from '../../../src/server/colonies/Triton';
import {Game} from '../../../src/server/Game';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {SelectColony} from '../../../src/server/inputs/SelectColony';
import {TestPlayer} from '../../TestPlayer';
import {AndOptions} from '../../../src/server/inputs/AndOptions';
import {newTestGame, getTestPlayer} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('TitanFloatingLaunchPad', function() {
  let card: TitanFloatingLaunchPad;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new TitanFloatingLaunchPad();
    game = newTestGame(2, {coloniesExtension: true, turmoilExtension: false});
    player = getTestPlayer(game, 0);
    // Second player is ignored.
  });

  it('Should act', function() {
    player.playedCards.push(card);
    expect(card.canAct()).is.true;
    expect(card.getVictoryPoints()).to.eq(1);
  });

  it('Should play with single targets', function() {
    player.game.colonies = []; // A way to simulate that no colonies are available.
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
    player.game.colonies = []; // A way to simulate that no colonies are available.

    const card2 = new JupiterFloatingStation();
    player.playedCards.push(card);
    player.playedCards.push(card2);

    card.action(player);
    expect(game.deferredActions).has.lengthOf(1);
    const selectCard = cast(game.deferredActions.peek()!.execute(), SelectCard<ICard>);
    selectCard.cb([card]);
    expect(card.resourceCount).to.eq(1);
  });

  it('Should play with multiple targets and colonies', function() {
    game.colonies = [new Luna(), new Triton()];

    const card2 = new JupiterFloatingStation();
    player.playedCards.push(card);
    player.playedCards.push(card2);
    player.addResourceTo(card, 7);

    const orOptions = cast(card.action(player), OrOptions);

    orOptions.options[1].cb(); // Add resource
    expect(game.deferredActions).has.lengthOf(1);
    const selectCard = cast(game.deferredActions.peek()!.execute(), SelectCard<ICard>);
    game.deferredActions.pop();
    selectCard.cb([card]);
    expect(card.resourceCount).to.eq(8);

    orOptions.options[0].cb(); // Trade for free
    expect(game.deferredActions).has.lengthOf(1);
    const selectColony = cast(game.deferredActions.peek()!.execute(), SelectColony);
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
    const tradeAction = cast(getTradeAction(), AndOptions);

    const payAction = cast(tradeAction.options[0], OrOptions);
    expect(payAction.title).eq('Pay trade fee');
    expect(payAction.options).has.length(1);

    const floaterOption = cast(payAction, OrOptions).options[0];
    expect(floaterOption.title).to.match(/Pay 1 Floater/);

    floaterOption.cb();
    tradeAction.options[1].cb(luna);

    expect(card.resourceCount).eq(0);
    expect(player.megaCredits).eq(2);
  });
});
