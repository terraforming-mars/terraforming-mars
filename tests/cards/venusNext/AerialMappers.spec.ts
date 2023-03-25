import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {ICard} from '../../../src/server/cards/ICard';
import {AerialMappers} from '../../../src/server/cards/venusNext/AerialMappers';
import {Dirigibles} from '../../../src/server/cards/venusNext/Dirigibles';
import {testGame} from '../../TestGame';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {TestPlayer} from '../../TestPlayer';

describe('AerialMappers', function() {
  let card: AerialMappers;
  let player: TestPlayer;

  beforeEach(function() {
    card = new AerialMappers();
    [/* skipped */, player] = testGame(2);
    player.playedCards.push(card);
  });

  it('Should play', function() {
    const action = card.play(player);
    expect(action).is.undefined;
  });

  it('Should act - multiple targets', function() {
    const card2 = new Dirigibles();
    player.playedCards.push(card2);
    const action = cast(card.action(player), SelectCard<ICard>);

    action.cb([card]);
    expect(card.resourceCount).to.eq(1);

    const orOptions = cast(card.action(player), OrOptions);

    orOptions.options[0].cb([card]);
    expect(card.resourceCount).to.eq(0);
    expect(player.cardsInHand).has.lengthOf(1);
  });

  it('Should act - single target', function() {
    card.action(player);
    expect(card.resourceCount).to.eq(1);

    const orOptions = cast(card.action(player), OrOptions);
    orOptions.options[0].cb([card]);
    expect(card.resourceCount).to.eq(0);
    expect(player.cardsInHand).has.lengthOf(1);
  });
});
