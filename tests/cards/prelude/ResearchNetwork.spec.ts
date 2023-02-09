import {expect} from 'chai';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {ResearchNetwork} from '../../../src/server/cards/prelude/ResearchNetwork';
import {Tag} from '../../../src/common/cards/Tag';
import {Units} from '../../../src/common/Units';

describe('ResearchNetwork', function() {
  it('Should play', function() {
    const game = newTestGame(1);
    const player = getTestPlayer(game, 0);
    const card = new ResearchNetwork();

    expect(player.cardsInHand).has.length(0);
    expect(player.production.asUnits()).deep.eq(Units.of({}));

    const action = card.play(player);
    expect(action).is.undefined;

    expect(player.cardsInHand).has.length(3);
    expect(player.production.asUnits()).deep.eq(Units.of({megacredits: 1}));

    expect(player.tags.count(Tag.WILD)).eq(0);
    expect(player.tags.count(Tag.BUILDING)).eq(0);

    player.playedCards.push(card);

    expect(player.tags.count(Tag.WILD)).eq(1);
    expect(player.tags.count(Tag.BUILDING)).eq(1);
    expect(player.tags.count(Tag.WILD, 'raw')).eq(1);
    expect(player.tags.count(Tag.BUILDING, 'raw')).eq(0);
  });
});
