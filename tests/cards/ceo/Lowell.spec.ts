import {expect} from 'chai';
import {LightningHarvest} from '../../../src/server/cards/base/LightningHarvest';
import {CardType} from '../../../src/common/cards/CardType';
import {ICard} from '../../../src/server/cards/ICard';
import {Game} from '../../../src/server/Game';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {forceGenerationEnd, fakeCard} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {Tag} from '../../../src/common/cards/Tag';
import {Lowell} from '../../../src/server/cards/ceos/Lowell';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('Lowell', function() {
  let card: Lowell;
  let player: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new Lowell();
    game = newTestGame(1, {ceoExtension: true, preludeExtension: true});
    player = getTestPlayer(game, 0);
    player.megaCredits = 8;
  });

  it('Has a wild tag', function() {
    player.playedCards.push(card);
    expect(player.tags.count(Tag.WILD)).eq(1);
    expect(player.tags.count(Tag.SPACE)).eq(1);
    expect(player.tags.count(Tag.SPACE, 'raw')).eq(0);
    expect(player.tags.count(Tag.SCIENCE)).eq(1);
    expect(player.tags.count(Tag.SCIENCE, 'raw')).eq(0);


    player.playedCards.push(fakeCard({tags: [Tag.SCIENCE, Tag.SCIENCE]}));
    const lightningHarvest = new LightningHarvest();
    expect(lightningHarvest.canPlay(player)).is.true;
  });

  it('Cannot act: Not enough M€', function() {
    player.megaCredits = 7;
    expect(card.canAct(player)).is.false;
  });

  it('Takes OPG action', function() {
    const selectCard = card.action(player) as SelectCard<ICard>;
    game.deferredActions.runNext();

    selectCard.cb([selectCard.cards[0]]);
    expect(player.playedCards.filter((card) => card.type === CardType.CEO).length).eq(1);
    expect(player.playedCards.includes(card)).is.false;
    expect(player.megaCredits).eq(0);
  });

  it('Can only act once per game', function() {
    card.action(player);
    forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });
});
