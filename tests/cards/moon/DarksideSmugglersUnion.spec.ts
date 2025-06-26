import {expect} from 'chai';
import {DarksideSmugglersUnion} from '../../../src/server/cards/moon/DarksideSmugglersUnion';
import {Luna} from '../../../src/server/colonies/Luna';
import {Triton} from '../../../src/server/colonies/Triton';
import {IGame} from '../../../src/server/IGame';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {SelectColony} from '../../../src/server/inputs/SelectColony';
import {TestPlayer} from '../../TestPlayer';
import {AndOptions} from '../../../src/server/inputs/AndOptions';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';
import {Message} from '../../../src/common/logs/Message';

describe('DarksideSmugglersUnion', () => {
  let card: DarksideSmugglersUnion;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new DarksideSmugglersUnion();
    // Second player is ignored.
    [game, player] = testGame(2, {coloniesExtension: true});
  });

  it('Should act', () => {
    player.playedCards.push(card);
    expect(card.canAct(player)).is.true;
  });

  it('Cannot act without available colonies', () => {
    player.game.colonies = []; // A way to simulate that no colonies are available.
    player.playedCards.push(card);
    game.colonies = []; // A way to fake out that no colonies are available.
    expect(card.canAct(player)).is.false;
  });

  it('Cannot act without trade fleets', () => {
    player.playedCards.push(card);
    expect(card.canAct(player)).is.true;
    player.colonies.tradesThisGeneration = player.colonies.getFleetSize();
    expect(card.canAct(player)).is.false;
  });

  it('Should play with multiple and colonies', () => {
    game.colonies = [new Luna(), new Triton()];

    player.playedCards.push(card);
    player.addResourceTo(card, 7);

    const selectColony = cast(card.action(player), SelectColony);
    selectColony.cb(selectColony.colonies[0]);
    expect(card.resourceCount).to.eq(7);
    expect(player.megaCredits).to.eq(2);
  });

  it('is available through standard trade action', () => {
    const luna = new Luna();
    player.game.colonies = [luna];

    const getTradeAction = () => player.getActions().options.find(
      (option) => option.title === 'Trade with a colony tile');

    player.playedCards.push(card);

    const tradeAction = cast(getTradeAction(), AndOptions);

    const payAction = cast(tradeAction.options[0], OrOptions);
    expect(payAction.title).eq('Pay trade fee');
    expect(payAction.options).has.length(1);

    const darksideOption = cast(payAction, OrOptions).options[0];
    expect((darksideOption.title as Message).message).to.match(/Trade for free/);

    darksideOption.cb();
    tradeAction.options[1].cb(luna);

    expect(player.megaCredits).eq(2);
  });
});
