import {expect} from 'chai';
import {SagittaFrontierServices} from '../../../src/server/cards/prelude2/SagittaFrontierServices';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {Units} from '../../../src/common/Units';
import {fakeCard, runAllActions} from '../../TestingUtils';
import {Tag} from '../../../src/common/cards/Tag';
import {CardType} from '../../../src/common/cards/CardType';
import {IGame} from '../../../src/server/IGame';

describe('SagittaFrontierServices', () => {
  let card: SagittaFrontierServices;
  let game: IGame;
  let player: TestPlayer;

  beforeEach(() => {
    card = new SagittaFrontierServices();
    [game, player] = testGame(1);
  });

  it('play', () => {
    player.playCorporationCard(card);
    runAllActions(game);
    expect(player.production.asUnits()).deep.eq(Units.of({energy: 1, megacredits: 2}));
    expect(player.stock.asUnits()).deep.eq(Units.of({megacredits: 32})); // +4 for playing this card.
    expect(player.cardsInHand).has.lengthOf(1);
    expect(player.cardsInHand[0].tags.length).eq(0);
  });

  it('Zero tags, gain 4 M€', () => {
    player.setCorporationForTest(card);
    card.onCardPlayed(player, fakeCard({tags: []}));
    runAllActions(game);
    expect(player.megaCredits).eq(4);
  });

  it('One tag, gain 1 M€', () => {
    player.setCorporationForTest(card);
    card.onCardPlayed(player, fakeCard({tags: [Tag.SCIENCE]}));
    runAllActions(game);
    expect(player.megaCredits).eq(1);
  });

  it('Event tag is a tag', () => {
    player.setCorporationForTest(card);
    card.onCardPlayed(player, fakeCard({type: CardType.EVENT, tags: []}));
    runAllActions(game);
    expect(player.megaCredits).eq(1);
  });

  it('Wild tag is not a tag', () => {
    player.setCorporationForTest(card);
    card.onCardPlayed(player, fakeCard({tags: [Tag.WILD]}));
    runAllActions(game);
    expect(player.megaCredits).eq(4);
  });
});
