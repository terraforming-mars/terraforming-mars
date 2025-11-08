import {expect} from 'chai';
import {HenkeiGenetics} from '../../../src/server/cards/underworld/HenkeiGenetics';
import {testGame} from '../../TestGame';
import {cast, fakeCard, runAllActions} from '../../TestingUtils';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {CardResource} from '../../../src/common/CardResource';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {Tag} from '../../../src/common/cards/Tag';

describe('HenkeiGenetics', () => {
  let card: HenkeiGenetics;
  let game: IGame;
  let player: TestPlayer;

  beforeEach(() => {
    card = new HenkeiGenetics();
    [game, player] = testGame(1);
  });

  it('Should play', () => {
    player.playCorporationCard(card);
    runAllActions(game);

    expect(player.underworldData.corruption).eq(1);
  });

  it('initial action', () => {
    cast(card.initialAction(player), undefined);
    expect(player.cardsInHand).to.have.length(2);
    expect(player.cardsInHand[0].tags).includes(Tag.MICROBE);
    expect(player.cardsInHand[1].tags).includes(Tag.MICROBE);
  });


  it('canAct', () => {
    player.playedCards.push(card);

    expect(card.canAct(player)).is.false;

    player.underworldData.corruption = 1;

    expect(card.canAct(player)).is.true;
  });

  it('action', () => {
    player.underworldData.corruption = 1;

    const microbeCards = [
      fakeCard({resourceType: CardResource.MICROBE}),
      fakeCard({resourceType: CardResource.MICROBE}),
      fakeCard({resourceType: CardResource.MICROBE}),
    ];

    player.playedCards.push(...microbeCards);
    const selectCard = cast(card.action(player), SelectCard);

    expect(selectCard.cards).to.have.members(microbeCards);
    selectCard.cb([microbeCards[0], microbeCards[2]]);

    expect(microbeCards[0].resourceCount).eq(3);
    expect(microbeCards[1].resourceCount).eq(0);
    expect(microbeCards[2].resourceCount).eq(3);
    expect(player.underworldData.corruption).eq(0);
  });
});
