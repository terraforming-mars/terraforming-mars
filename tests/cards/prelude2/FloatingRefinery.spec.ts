import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {toName} from '../../../src/common/utils/utils';
import {FloatingRefinery} from '../../../src/server/cards/prelude2/FloatingRefinery';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {IProjectCard} from '../../../src/server/cards/IProjectCard';
import {TitanShuttles} from '../../../src/server/cards/colonies/TitanShuttles';
import {FloatingHabs} from '../../../src/server/cards/venusNext/FloatingHabs';
import {MartianCulture} from '../../../src/server/cards/pathfinders/MartianCulture';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {ICard} from '../../../src/server/cards/ICard';
import {runAllActions} from '../../TestingUtils';
import {IGame} from '../../../src/server/IGame';

describe('FloatingRefinery', () => {
  let card: FloatingRefinery;
  let player: TestPlayer;
  let game: IGame;

  let floater1: IProjectCard;
  let floater2: IProjectCard;
  let other: IProjectCard;

  beforeEach(() => {
    card = new FloatingRefinery();
    floater1 = new TitanShuttles();
    floater2 = new FloatingHabs();
    other = new MartianCulture();
    [game, player] = testGame(2, {preludeExtension: true});
    player.playedCards = [floater1, floater2, other];
  });

  it('Play', () => {
    player.tagsForTest = {venus: 5};
    card.play(player);
    runAllActions(game);

    expect(card.resourceCount).to.eq(6);
  });

  it('Add resources', () => {
    player.playedCards.push(card);
    cast(card.action(player), undefined);
    expect(card.resourceCount).to.eq(1);
  });

  it('Remove resource - this card', () => {
    player.playedCards.push(card);
    card.resourceCount = 3;
    const orOptions = cast(card.action(player), OrOptions);
    cast(card.action(player), OrOptions);
    const selectCard = cast(orOptions.options[0].cb(), SelectCard<ICard>);
    expect(selectCard.cards.map(toName)).deep.eq([card.name]);
    selectCard.cb([card]);
    expect(player.stock.titanium).to.eq(1);
    expect(player.stock.megacredits).to.eq(2);
    expect(card.resourceCount).to.eq(1);
  });

  it('act - two cards with 2 floaters - select 1st', () => {
    card.resourceCount = 1;
    floater1.resourceCount = 2;
    floater2.resourceCount = 2;
    other.resourceCount = 1;

    const orOptions = cast(card.action(player), OrOptions);
    cast(card.action(player), OrOptions);
    const selectCard = cast(orOptions.options[0].cb(), SelectCard<ICard>);
    expect(selectCard.cards).has.length(2);
    selectCard.cb([selectCard.cards[0]]);
    expect(floater1.resourceCount).eq(0);
    expect(floater2.resourceCount).eq(2);
    expect(other.resourceCount).eq(1);
    expect(card.resourceCount).eq(1);
    expect(player.stock.titanium).to.eq(1);
    expect(player.stock.megacredits).to.eq(2);
  });

  it('act - two cards with 2 floaters - select 2nd', () => {
    card.resourceCount = 1;
    floater1.resourceCount = 2;
    floater2.resourceCount = 2;
    other.resourceCount = 1;

    const orOptions = cast(card.action(player), OrOptions);
    cast(card.action(player), OrOptions);
    const selectCard = cast(orOptions.options[0].cb(), SelectCard<ICard>);
    expect(selectCard.cards).has.length(2);
    selectCard.cb([selectCard.cards[1]]);
    expect(floater1.resourceCount).eq(2);
    expect(floater2.resourceCount).eq(0);
    expect(other.resourceCount).eq(1);
    expect(card.resourceCount).eq(1);
    expect(player.stock.titanium).to.eq(1);
    expect(player.stock.megacredits).to.eq(2);
  });
});
