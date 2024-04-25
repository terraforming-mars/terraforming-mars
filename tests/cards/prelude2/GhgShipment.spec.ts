import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {GhgShipment} from '../../../src/server/cards/prelude2/GhgShipment';
import {JovianLanterns} from '../../../src/server/cards/colonies/JovianLanterns';
import {SearchForLife} from '../../../src/server/cards/base/SearchForLife';
import {cast, setRulingParty} from '../../TestingUtils';
import {PartyName} from '../../../src/common/turmoil/PartyName';

describe('GhgShipment', () => {
  it('canPlay', () => {
    const card = new GhgShipment();
    const [game, player] = testGame(1, {turmoilExtension: true});

    expect(card.canPlay(player)).is.false;

    setRulingParty(game, PartyName.KELVINISTS);

    expect(card.canPlay(player)).is.true;
  });

  it('play', () => {
    const card = new GhgShipment();
    const [/* game */, player] = testGame(1, {turmoilExtension: true});

    const jovianLanterns = new JovianLanterns();
    const searchForLife = new SearchForLife();

    player.playedCards = [jovianLanterns, searchForLife];

    searchForLife.resourceCount = 2;
    jovianLanterns.resourceCount = 5;

    cast(card.play(player), undefined);

    expect(player.production.heat).eq(1);
    expect(player.stock.heat).eq(5);
  });
});
