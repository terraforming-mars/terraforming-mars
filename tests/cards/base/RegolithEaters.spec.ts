import {expect} from 'chai';
import {cast, churn, runAllActions, setRulingParty} from '../../TestingUtils';
import {RegolithEaters} from '../../../src/server/cards/base/RegolithEaters';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {testGame} from '../../TestGame';
import {PartyName} from '../../../src/common/turmoil/PartyName';

describe('RegolithEaters', () => {
  it('Should act', () => {
    const card = new RegolithEaters();
    const [game, player] = testGame(2);

    player.playedCards.push(card);
    expect(churn(card.action(player), player)).is.undefined;
    expect(card.resourceCount).to.eq(1);

    expect(churn(card.action(player), player)).is.undefined;
    expect(card.resourceCount).to.eq(2);

    const orOptions = cast(churn(card.action(player), player), OrOptions);

    orOptions.options[1].cb();
    runAllActions(game);
    expect(card.resourceCount).to.eq(3);

    orOptions.options[0].cb();
    runAllActions(game);
    expect(card.resourceCount).to.eq(1);
    expect(game.getOxygenLevel()).to.eq(1);
  });

  it('Cannot act with reds, 2MC', () => {
    const card = new RegolithEaters();
    const [game, player] = testGame(2, {turmoilExtension: true});

    setRulingParty(game, PartyName.REDS);

    card.resourceCount = 2;
    player.megaCredits = 2;
    cast(card.action(player), undefined);
    runAllActions(game);
    cast(player.popWaitingFor(), undefined);

    expect(card.resourceCount).to.eq(3);
  });

  it('Can act with reds, 3MC', () => {
    const card = new RegolithEaters();
    const [game, player] = testGame(2, {turmoilExtension: true});

    setRulingParty(game, PartyName.REDS);

    card.resourceCount = 2;
    player.megaCredits = 3;
    cast(card.action(player), undefined);
    runAllActions(game);
    const orOptions = cast(churn(card.action(player), player), OrOptions);

    orOptions.options[0].cb();
    runAllActions(game);
    expect(card.resourceCount).to.eq(0);
    expect(game.getOxygenLevel()).to.eq(1);
    expect(player.megaCredits).eq(0);
  });
});
