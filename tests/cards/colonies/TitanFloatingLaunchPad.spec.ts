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
import {TestPlayers} from '../../TestPlayers';
import {AndOptions} from '../../../src/inputs/AndOptions';
import {TestingUtils} from '../../TestingUtils';

describe('TitanFloatingLaunchPad', function() {
  let card : TitanFloatingLaunchPad; let player : Player; let game : Game;

  beforeEach(function() {
    card = new TitanFloatingLaunchPad();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Should act', function() {
    player.playedCards.push(card);
    expect(card.canAct()).is.true;
    expect(card.getVictoryPoints()).to.eq(1);
  });

  it('Should play with single targets', function() {
    player.playedCards.push(card);

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
    const colony1 = new Luna();
    const colony2 = new Triton();
    player.game.colonies.push(colony1);
    player.game.colonies.push(colony2);

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
    const tradeAction = TestingUtils.cast(AndOptions, getTradeAction());

    const payAction = TestingUtils.cast(OrOptions, tradeAction.options[0]);
    expect(payAction.title).eq('Pay trade fee');
    expect(payAction.options).has.length(1);

    const floaterOption = payAction.options[0];
    expect(floaterOption.title).to.match(/Pay 1 Floater/);

    floaterOption.cb();
    tradeAction.options[1].cb(luna);

    expect(card.resourceCount).eq(0);
    expect(player.megaCredits).eq(2);
  });
});
