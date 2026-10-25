import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {LunaTradeFederation} from '../../../src/server/cards/moon/LunaTradeFederation';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {fakeCard, runAllActions} from '../../TestingUtils';
import {Units} from '../../../src/common/Units';
import {cast} from '@/common/utils/utils';
import {SelectPayment} from '@/server/inputs/SelectPayment';
import {Payment} from '@/common/inputs/Payment';
import {Tag} from '../../../src/common/cards/Tag';

describe('LunaTradeFederation', () => {
  let game: IGame;
  let player: TestPlayer;
  let player2: TestPlayer;
  let lunaTradeFederation: LunaTradeFederation;

  beforeEach(() => {
    [game, player, player2] = testGame(2, {moonExpansion: true});
    lunaTradeFederation = new LunaTradeFederation();
  });

  it('play', () => {
    expect(player.canUseTitaniumAsMegacredits).is.false;
    player.playCorporationCard(lunaTradeFederation);
    runAllActions(game);
    expect(player.titanium).eq(10);
    expect(player.megaCredits).eq(15);
    expect(player.canUseTitaniumAsMegacredits).is.true;
  });

  it('onTilePlaced', () => {
    player.playedCards.push(lunaTradeFederation);

    MoonExpansion.addRoadTile(player, 'm07');
    expect(player.production.asUnits()).deep.eq(Units.of({}));

    MoonExpansion.addMineTile(player, 'm08');
    expect(player.production.asUnits()).deep.eq(Units.of({titanium: 1}));

    MoonExpansion.addRoadTile(player2, 'm09');
    expect(player.production.asUnits()).deep.eq(Units.of({titanium: 1}));

    MoonExpansion.addMineTile(player2, 'm10');
    expect(player.production.asUnits()).deep.eq(Units.of({titanium: 1}));
  });

  it('can use titanium to pay for space project cards as normal', () => {
    player.playedCards.push(lunaTradeFederation);
    lunaTradeFederation.play(player);
    expect(player.canUseTitaniumAsMegacredits).is.true;

    const card = fakeCard({cost: 10, tags: [Tag.SPACE]});
    player.megaCredits = 6;
    player.titanium = 1;

    expect(player.canAfford(player.affordOptionsForCard(card))).is.false;

    player.megaCredits = 7;
    player.titanium = 1;
    expect(player.canAfford(player.affordOptionsForCard(card))).is.true;
  });

  it('can use titanium to pay for non-space project cards at a discount', () => {
    player.playedCards.push(lunaTradeFederation);
    lunaTradeFederation.play(player);
    expect(player.canUseTitaniumAsMegacredits).is.true;

    const card = fakeCard({cost: 10, tags: [Tag.MICROBE]});
    player.megaCredits = 7;
    player.titanium = 1;

    expect(player.spendableMegacredits()).eq(9);
    expect(player.canAfford(player.affordOptionsForCard(card))).is.false;

    player.megaCredits = 8;
    player.titanium = 1;
    expect(player.spendableMegacredits()).eq(10);
    expect(player.canAfford(player.affordOptionsForCard(card))).is.true;

    player.megaCredits = 8;
    player.titanium = 3;
    expect(player.spendableMegacredits()).eq(14);

    player.increaseTitaniumValue();

    expect(player.spendableMegacredits()).eq(17);
  });

  it('can use titanium for other purchases', () => {

  });

  it('pays for initial cards with titanium', () => {
    for (let i = 0; i < 8; i++) {
      player.cardsInHand.push(fakeCard());
    }
    player.playCorporationCard(lunaTradeFederation);
    runAllActions(game);

    expect(player.megaCredits).eq(15);
    expect(player.titanium).eq(10);

    // 8 cards cost 24 M€.
    const selectPayment = cast(player.popWaitingFor(), SelectPayment);
    expect(selectPayment.amount).eq(24);
    expect(() => selectPayment.process({type: 'payment', payment: Payment.of({megacredits: 13, titanium: 5})}, player)).to.throw(/Did not spend enough/);
    selectPayment.process({type: 'payment', payment: Payment.of({megacredits: 14, titanium: 5})}, player);

    expect(player.megaCredits).eq(1);
    expect(player.titanium).eq(5);
  });

  it('may pay for initial cards with only M€', () => {
    for (let i = 0; i < 5; i++) {
      player.cardsInHand.push(fakeCard());
    }
    player.playCorporationCard(lunaTradeFederation);
    runAllActions(game);

    const selectPayment = cast(player.popWaitingFor(), SelectPayment);
    selectPayment.process({type: 'payment', payment: Payment.of({megacredits: 15})}, player);

    expect(player.megaCredits).eq(0);
    expect(player.titanium).eq(10);
  });

  it('no payment prompt when keeping no initial cards', () => {
    player.playCorporationCard(lunaTradeFederation);
    runAllActions(game);

    expect(player.popWaitingFor()).is.undefined;
    expect(player.megaCredits).eq(15);
  });
});
