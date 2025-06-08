import {expect} from 'chai';
import {LightningHarvest} from '../../../src/server/cards/base/LightningHarvest';
import {CardType} from '../../../src/common/cards/CardType';
import {ICeoCard} from '../../../src/server/cards/ceos/ICeoCard';
import {IGame} from '../../../src/server/IGame';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {forceGenerationEnd, fakeCard, cast, runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {Tag} from '../../../src/common/cards/Tag';
import {Lowell} from '../../../src/server/cards/ceos/Lowell';
import {testGame} from '../../TestGame';

describe('Lowell', () => {
  let card: Lowell;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new Lowell();
    [game, player] = testGame(1, {ceoExtension: true, preludeExtension: true});
    player.megaCredits = 8;
  });

  it('Has a wild tag', () => {
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

  it('Cannot act: Not enough M€', () => {
    player.megaCredits = 7;
    expect(card.canAct(player)).is.false;
  });

  it('Takes OPG action', () => {
    cast(card.action(player), undefined);
    runAllActions(game);

    const selectCard = cast(player.popWaitingFor(), SelectCard<ICeoCard>);
    selectCard.cb([selectCard.cards[0]]);

    expect(player.playedCards.filter((card) => card.type === CardType.CEO)).has.length(1);
    expect(player.playedCards.get(card.name)).is.undefined;
    expect(player.megaCredits).eq(0);
  });

  it('Can only act once per game', () => {
    card.action(player);
    forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });
});
