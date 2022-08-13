import {expect} from 'chai';
import {NobelLabs} from '../../../src/server/cards/pathfinders/NobelLabs';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {IProjectCard} from '../../../src/server/cards/IProjectCard';
import {RegolithEaters} from '../../../src/server/cards/base/RegolithEaters';
import {SearchForLife} from '../../../src/server/cards/base/SearchForLife';
import {FloatingHabs} from '../../../src/server/cards/venusNext/FloatingHabs';
import {MartianCulture} from '../../../src/server/cards/pathfinders/MartianCulture';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {cast} from '../../TestingUtils';

describe('NobelLabs', function() {
  let card: NobelLabs;
  let player: TestPlayer;
  let game: Game;
  let floater: IProjectCard;
  let microbe: IProjectCard;
  let data: IProjectCard;
  let science: IProjectCard;

  beforeEach(function() {
    card = new NobelLabs();
    game = newTestGame(1);
    player = getTestPlayer(game, 0);

    floater = new FloatingHabs();
    microbe = new RegolithEaters();
    data = new MartianCulture();
    science = new SearchForLife();
  });

  it('canPlay', function() {
    player.megaCredits = card.cost;
    player.tagsForTest = {science: 3};
    expect(player.canPlay(card)).is.false;
    player.tagsForTest = {science: 4};
    expect(player.canPlay(card)).is.true;
  });

  it('canAct', function() {
    expect(card.canAct(player)).is.false;
    player.playedCards = [science];
    expect(card.canAct(player)).is.false;
    player.playedCards = [data];
    expect(card.canAct(player)).is.true;
    player.playedCards = [microbe];
    expect(card.canAct(player)).is.true;
    player.playedCards = [floater];
    expect(card.canAct(player)).is.true;
  });

  it('action', function() {
    player.playedCards = [floater, data, microbe, science];

    card.action(player);

    const selectCard = cast(game.deferredActions.pop()?.execute(), SelectCard);
    expect(selectCard.cards).to.have.members([floater, microbe, data]);

    selectCard.cb([floater]);
    expect(floater.resourceCount).eq(2);
    selectCard.cb([microbe]);
    expect(microbe.resourceCount).eq(2);
    selectCard.cb([data]);
    expect(data.resourceCount).eq(2);
  });
});
