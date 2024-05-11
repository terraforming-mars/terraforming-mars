import {expect} from 'chai';
import {cast, runAllActions} from '../../TestingUtils';
import {ICard} from '../../../src/server/cards/ICard';
import {AerialMappers} from '../../../src/server/cards/venusNext/AerialMappers';
import {Dirigibles} from '../../../src/server/cards/venusNext/Dirigibles';
import {testGame} from '../../TestGame';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {TestPlayer} from '../../TestPlayer';
import {IGame} from '../../../src/server/IGame';

describe('AerialMappers', function() {
  let card: AerialMappers;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new AerialMappers();
    [game, player] = testGame(2);
    player.playedCards.push(card);
  });

  it('Should play', function() {
    cast(card.play(player), undefined);
  });

  it('Should act - multiple targets', function() {
    const card2 = new Dirigibles();
    player.playedCards.push(card2);
    card.action(player);
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectCard<ICard>);

    action.cb([card]);
    expect(card.resourceCount).to.eq(1);

    card.action(player);
    runAllActions(game);
    const orOptions = cast(player.popWaitingFor(), OrOptions);

    orOptions.options[0].cb([card]);
    expect(card.resourceCount).to.eq(0);
    expect(player.cardsInHand).has.lengthOf(1);
  });

  it('Should act - single target', function() {
    card.action(player);
    runAllActions(game);
    expect(card.resourceCount).to.eq(1);

    card.action(player);
    runAllActions(game);
    const orOptions = cast(player.popWaitingFor(), OrOptions);

    orOptions.options[0].cb([card]);
    expect(card.resourceCount).to.eq(0);
    expect(player.cardsInHand).has.lengthOf(1);
  });
});
