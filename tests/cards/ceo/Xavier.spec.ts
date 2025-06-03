import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {Xavier} from '../../../src/server/cards/ceos/Xavier';
import {Cartel} from '../../../src/server/cards/base/Cartel';
import {GeneRepair} from '../../../src/server/cards/base/GeneRepair';
import {LightningHarvest} from '../../../src/server/cards/base/LightningHarvest';
import {SearchForLife} from '../../../src/server/cards/base/SearchForLife';
import {SulphurExports} from '../../../src/server/cards/venusNext/SulphurExports';
import {Ecologist} from '../../../src/server/milestones/Ecologist';
import {forceGenerationEnd, runAllActions} from '../../TestingUtils';
import {Diversifier} from '../../../src/server/milestones/Diversifier';
import {Tag} from '../../../src/common/cards/Tag';
import {CommunityServices} from '../../../src/server/cards/colonies/CommunityServices';


describe('Xavier', () => {
  let card: Xavier;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new Xavier();
    [game, player] = testGame(2, {ceoExtension: true});
    player.playedCards.push(card);
  });

  it('Counts tags', () => {
    expect(card.tags).deep.eq([]);

    card.action();

    expect(card.tags).deep.eq([Tag.WILD, Tag.WILD]);

    player.runProductionPhase();

    expect(card.tags).deep.eq([]);
  });

  it('Takes action once per game: Can play cards with tag requirements', () => {
    player.playedCards.push(new SearchForLife()); // Contains a science tag
    const lightningHarvest = new LightningHarvest();
    const geneRepair = new GeneRepair();
    player.cardsInHand.push(lightningHarvest);

    expect(lightningHarvest.canPlay(player)).is.false;

    // Once per game, can gain 2 wild tags for the generation
    card.action();
    player.actionsThisGeneration.add(card.name);

    expect(lightningHarvest.canPlay(player)).is.true;

    lightningHarvest.play(player);

    expect(geneRepair.canPlay(player)).is.true;

    // Bonus wild tags are lost next generation
    runAllActions(game);

    expect(card.isDisabled).is.true;

    player.runProductionPhase();

    expect(geneRepair.canPlay(player)).is.false;
  });

  it('Takes action once per game: Can use wild tags as production', () => {
    const sulphurExports = new SulphurExports();
    player.cardsInHand.push(sulphurExports);

    // Once per game, can gain 2 wild tags for the generation
    card.action();
    player.actionsThisGeneration.add(card.name);

    // Resolve payment - 2 wild tags count for production effect
    sulphurExports.play(player);
    expect(player.production.megacredits).to.eq(3);

    // Bonus wild tags are lost next generation
    runAllActions(game);
    expect(card.isDisabled).is.true;
    player.runProductionPhase();

    const cartel = new Cartel();
    cartel.play(player);
    expect(player.production.megacredits).eq(4);
  });

  it('Gives discount for cards with requirements', () => {
    const lightningHarvest = new LightningHarvest();
    const geneRepair = new GeneRepair();

    expect(card.getCardDiscount(player, lightningHarvest)).eq(0);
    expect(card.getCardDiscount(player, geneRepair)).eq(0);
    card.action();
    player.actionsThisGeneration.add(card.name);
    expect(card.isDisabled).is.true;
    expect(card.getCardDiscount(player, lightningHarvest)).eq(1);
    expect(card.getCardDiscount(player, geneRepair)).eq(1);

    // Persists over generations
    runAllActions(game);
    expect(card.isDisabled).is.true;
    player.runProductionPhase();
    expect(card.getCardDiscount(player, lightningHarvest)).eq(1);
    expect(card.getCardDiscount(player, geneRepair)).eq(1);
  });

  it('Works with milestones', () => {
    const ecologist = new Ecologist();
    expect(ecologist.getScore(player)).eq(0);

    // Once per game, can gain 2 wild tags for the generation
    card.action();
    player.actionsThisGeneration.add(card.name);
    expect(ecologist.getScore(player)).eq(2);

    // Bonus wild tags are lost next generation
    forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(ecologist.getScore(player)).eq(0);
  });

  it('Works with Diversifier', () => {
    const diversifier = new Diversifier();

    expect(diversifier.getScore(player)).eq(0);

    card.action();

    expect(diversifier.getScore(player)).eq(2);
  });

  it('Stays out of the way of counting card with no tags', () => {
    expect(player.tags.numberOfCardsWithNoTags()).eq(1);

    card.action();

    expect(player.tags.numberOfCardsWithNoTags()).eq(1);
    expect(card.tags).deep.eq([Tag.WILD, Tag.WILD]);

    const communityServices = new CommunityServices();
    communityServices.play(player);

    player.runProductionPhase();

    expect(player.tags.numberOfCardsWithNoTags()).eq(1);
  });

  it('Works with Community Services', () => {
    const communityServices = new CommunityServices();
    communityServices.play(player);

    expect(player.production.megacredits).eq(2);

    card.action();
    communityServices.play(player);

    expect(player.production.megacredits).eq(4);
  });
});
