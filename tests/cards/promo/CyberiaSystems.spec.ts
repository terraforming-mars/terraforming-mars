import {expect} from 'chai';
import {FoodFactory} from '../../../src/server/cards/base/FoodFactory';
import {NoctisFarming} from '../../../src/server/cards/base/NoctisFarming';
import {CyberiaSystems} from '../../../src/server/cards/promo/CyberiaSystems';
import {IGame} from '../../../src/server/IGame';
import {cast, runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {testGame} from '../../TestGame';
import {TitaniumMine} from '../../../src/server/cards/base/TitaniumMine';

describe('CyberiaSystems', () => {
  let card: CyberiaSystems;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new CyberiaSystems();
    [game, player] = testGame(2);
  });

  it('Cannot play if no building cards to copy', () => {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Cannot play when production must go down', () => {
    // Food factory needs one unit of plant production
    player.playedCards.push(new FoodFactory());
    player.playedCards.push(new TitaniumMine());
    expect(card.canPlay(player)).is.not.true;

    player.production.override({plants: 1});
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', () => {
    const noctisFarming = new NoctisFarming();
    player.playedCards.push(noctisFarming);
    const titaniumMine = new TitaniumMine();
    player.playedCards.push(titaniumMine);

    cast(card.play(player), undefined);

    expect(player.production.steel).eq(1);

    runAllActions(game);

    const selectCard = cast(player.popWaitingFor(), SelectCard);
    expect(selectCard.cards).to.have.members([noctisFarming, titaniumMine]);
    selectCard.cb([noctisFarming]);
    expect(player.production.megacredits).to.eq(1);

    runAllActions(game);
    const selectSecondCard = cast(player.popWaitingFor(), SelectCard);
    expect(selectSecondCard.cards).to.have.members([titaniumMine]);
    selectSecondCard.cb([titaniumMine]);
    expect(player.production.titanium).to.eq(1);
  });
});
