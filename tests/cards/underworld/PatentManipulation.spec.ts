import {expect} from 'chai';
import {PatentManipulation} from '../../../src/server/cards/underworld/PatentManipulation';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';
import {cardsFromJSON, newProjectCard} from '../../../src/server/createCard';
import {CardName} from '../../../src/common/cards/CardName';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {MicroMills} from '../../../src/server/cards/base/MicroMills';
import {AICentral} from '../../../src/server/cards/base/AICentral';
import {BribedCommittee} from '../../../src/server/cards/base/BribedCommittee';
import {MoholeArea} from '../../../src/server/cards/base/MoholeArea';
import {AstraMechanica} from '../../../src/server/cards/promo/AstraMechanica';

describe('PatentManipulation', () => {
  const canPlayRuns = [
    {corruption: 0, playedCards: [], expected: false},
    {corruption: 0, playedCards: [CardName.MICRO_MILLS], expected: false},
    {corruption: 1, playedCards: [CardName.MICRO_MILLS], expected: true},
    {corruption: 1, playedCards: [CardName.AI_CENTRAL], expected: true},
    {corruption: 1, playedCards: [CardName.BRIBED_COMMITTEE], expected: false},
    {corruption: 1, playedCards: [CardName.MOHOLE_AREA], expected: false},
    {corruption: 1, playedCards: [CardName.MICRO_MILLS, CardName.BRIBED_COMMITTEE, CardName.MOHOLE_AREA], expected: true},
  ] as const;

  for (const run of canPlayRuns) {
    it('canPlay ' + JSON.stringify(run), () => {
      const card = new PatentManipulation();
      const [/* game */, player] = testGame(2, {underworldExpansion: true});
      player.underworldData.corruption = run.corruption;
      player.playedCards.push(...cardsFromJSON([...run.playedCards]));
      expect(card.canPlay(player)).eq(run.expected);
    });
  }

  it('play', () => {
    const card = new PatentManipulation();
    const [/* game */, player] = testGame(2, {underworldExpansion: true});
    const microMills = new MicroMills();
    const aiCentral = new AICentral();
    const bribedCommittee = new BribedCommittee();
    const moholeArea = new MoholeArea();
    const astraMechanica = new AstraMechanica();
    player.playedCards.push(microMills, aiCentral, bribedCommittee, moholeArea, astraMechanica);
    player.cardsInHand = [];
    const selectCard = cast(card.play(player), SelectCard);

    expect(selectCard.cards).to.have.members([microMills, aiCentral]);

    selectCard.cb([microMills]);

    expect(player.playedCards.asArray()).to.have.members([aiCentral, bribedCommittee, moholeArea, astraMechanica]);
    expect(player.cardsInHand).to.have.members([microMills]);
  });

  it('Fixes #6934', () => {
    const card = new PatentManipulation();
    const [/* game */, player] = testGame(2, {underworldExpansion: true});
    const tardigrades = newProjectCard(CardName.TARDIGRADES)!;
    player.playedCards.push(tardigrades);
    tardigrades.resourceCount = 5;
    player.cardsInHand = [];
    const selectCard = cast(card.play(player), SelectCard);

    expect(selectCard.cards).to.have.members([tardigrades]);

    selectCard.cb([tardigrades]);

    expect(player.cardsInHand).to.have.members([tardigrades]);
    expect(player.playedCards.length).eq(0);
    expect(tardigrades.resourceCount).eq(0);
  });
});
