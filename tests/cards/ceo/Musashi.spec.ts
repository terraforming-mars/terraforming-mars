import {expect} from 'chai';
import {Cartel} from '../../../src/server/cards/base/Cartel';
import {EarthOffice} from '../../../src/server/cards/base/EarthOffice';
import {LunaGovernor} from '../../../src/server/cards/colonies/LunaGovernor';
import {IProjectCard} from '../../../src/server/cards/IProjectCard';
import {Musashi} from '../../../src/server/cards/ceos/Musashi';
import {Tag} from '../../../src/common/cards/Tag';
import {Game} from '../../../src/server/Game';
import {SelectAmount} from '../../../src/server/inputs/SelectAmount';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {forceGenerationEnd} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';


describe('Musashi', function() {
  let card: Musashi;
  let player: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new Musashi();
    game = newTestGame(1,);
    player = getTestPlayer(game, 0);
  });

  it('Takes action with no Earth cards', function() {
    expect(player.titanium).to.eq(0);
    expect(card.canAct(player)).is.true;
    const selectAmount = card.action(player) as SelectAmount;
    selectAmount.cb(0);
    game.deferredActions.runAll(() => {});
    expect(player.titanium).to.eq(6);
  });

  it('Takes action', function() {
    player.cardsInHand.push(new EarthOffice(), new LunaGovernor(), new Cartel());
    expect(player.titanium).to.eq(0);
    const selectAmount = card.action(player) as SelectAmount;
    selectAmount.cb(3);
    const selectCardsToDiscard = game.deferredActions.pop()!.execute() as SelectCard<IProjectCard>;
    selectCardsToDiscard.cb([...selectCardsToDiscard.cards]);

    game.deferredActions.runAll(() => {});
    expect(player.cardsInHand).has.length(3);

    // Make sure all the drawn cards have Space tag
    expect(player.cardsInHand.some((card) => !card.tags.includes(Tag.SPACE))).is.false;
    expect(player.titanium).to.eq(9);
  });

  it('Can only act once per game', function() {
    player.cardsInHand.push(new EarthOffice(), new LunaGovernor(), new Cartel());
    (card.action(player) as SelectAmount).cb(2);

    forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });
});
