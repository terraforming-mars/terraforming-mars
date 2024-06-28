import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {TheArchaicFoundationInstitute} from '../../../src/server/cards/moon/TheArchaicFoundationInstitute';
import {expect} from 'chai';
import {MicroMills} from '../../../src/server/cards/base/MicroMills';
import {HE3ProductionQuotas} from '../../../src/server/cards/moon/HE3ProductionQuotas';
import {LunaTradeStation} from '../../../src/server/cards/moon/LunaTradeStation';
import {CosmicRadiation} from '../../../src/server/cards/moon/CosmicRadiation';
import {GeodesicTents} from '../../../src/server/cards/moon/GeodesicTents';
import {DeepLunarMining} from '../../../src/server/cards/moon/DeepLunarMining';
import {Habitat14} from '../../../src/server/cards/moon/Habitat14';
import {testGame} from '../../TestGame';
import {cast, runAllActions, setRulingParty} from '../../TestingUtils';
import {PartyName} from '../../../src/common/turmoil/PartyName';

describe('TheArchaicFoundationInstitute', () => {
  let player: TestPlayer;
  let game: IGame;
  let card: TheArchaicFoundationInstitute;

  beforeEach(() => {
    [game, player] = testGame(1, {moonExpansion: true, turmoilExtension: true});
    card = new TheArchaicFoundationInstitute();
    player.corporations.push(card);
  });

  it('effect', () => {
    card.resourceCount = 0;
    expect(player.getTerraformRating()).eq(14);

    card.onCardPlayed(player, new MicroMills());
    expect(card.resourceCount).eq(0);
    expect(player.getTerraformRating()).eq(14);

    card.onCardPlayed(player, new HE3ProductionQuotas());
    expect(card.resourceCount).eq(1);
    expect(player.getTerraformRating()).eq(14);

    card.onCardPlayed(player, new CosmicRadiation());
    expect(card.resourceCount).eq(2);
    expect(player.getTerraformRating()).eq(14);

    card.onCardPlayed(player, new GeodesicTents());
    expect(card.resourceCount).eq(0);
    expect(player.getTerraformRating()).eq(15);

    card.onCardPlayed(player, new DeepLunarMining());
    expect(card.resourceCount).eq(1);
    expect(player.getTerraformRating()).eq(15);


    card.onCardPlayed(player, new Habitat14());
    expect(card.resourceCount).eq(2);
    expect(player.getTerraformRating()).eq(15);

    // Two moon tags
    card.onCardPlayed(player, new LunaTradeStation());
    expect(card.resourceCount).eq(1);
    expect(player.getTerraformRating()).eq(16);
  });

  it('Cannot automatically deduct when player cannot afford reds cost', () => {
    expect(player.getTerraformRating()).eq(14);
    player.megaCredits = 0;
    card.resourceCount = 2;

    setRulingParty(game, PartyName.REDS);

    // Two moon tags
    card.onCardPlayed(player, new LunaTradeStation());
    expect(card.resourceCount).eq(4);
    expect(player.getTerraformRating()).eq(14);

    expect(card.canAct(player)).is.false;
  });

  it('When reds are in power, can autodeduct with enough MC.', () => {
    expect(player.getTerraformRating()).eq(14);
    player.megaCredits = 4;
    card.resourceCount = 2;

    setRulingParty(game, PartyName.REDS);

    // Two moon tags
    card.onCardPlayed(player, new LunaTradeStation());
    expect(card.resourceCount).eq(1);
    runAllActions(game);
    expect(player.getTerraformRating()).eq(15);
    expect(player.megaCredits).eq(1);
  });

  it('If there are more than 3, you can take action.', () => {
    player.megaCredits = 0;
    card.resourceCount = 8;

    expect(card.canAct(player)).is.true;
    cast(card.action(player), undefined);
    runAllActions(game);

    expect(card.resourceCount).eq(2);
    expect(player.getTerraformRating()).eq(16);
  });

  it('Reds in effect, 8 resources, enough MC to raise once.', () => {
    player.megaCredits = 0;
    card.resourceCount = 8;
    setRulingParty(game, PartyName.REDS);

    expect(card.canAct(player)).is.false;
    player.megaCredits = 3;
    expect(card.canAct(player)).is.true;
    cast(card.action(player), undefined);
    runAllActions(game);

    expect(card.resourceCount).eq(5);
    expect(player.getTerraformRating()).eq(15);
    expect(player.megaCredits).eq(0);
  });

  it('Reds in effect, 8 resources, enough money.', () => {
    player.megaCredits = 10;
    card.resourceCount = 8;
    setRulingParty(game, PartyName.REDS);

    expect(card.canAct(player)).is.true;
    cast(card.action(player), undefined);
    runAllActions(game);

    expect(card.resourceCount).eq(2);
    expect(player.getTerraformRating()).eq(16);
    expect(player.megaCredits).eq(4);
  });
});
