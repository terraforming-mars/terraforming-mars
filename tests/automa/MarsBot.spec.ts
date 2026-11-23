import {expect} from 'chai';
import {BonusCardName} from '@/common/automa/BonusCardName';
import {ColonyName} from '@/common/colonies/ColonyName';
import {SeededRandom} from '@/common/utils/Random';
import {MarsBot} from '@/server/automa/MarsBot';
import {THARSIS_MARSBOT_BOARD} from '@/server/automa/boards/TharsisMarsBot';
import {createBonusCard} from '@/server/automa/bonusCards/MarsBotBonusCards';
import {Banker} from '@/server/awards/Banker';
import {Landlord} from '@/server/awards/Landlord';
import {TestGameOptions, testGame} from '../TestGame';
import {setTemperature} from '../TestingUtils';

describe('MarsBot', () => {
  function newMarsBot(options: Partial<TestGameOptions> = {}): MarsBot {
    const [game, human] = testGame(1, {automa: true, ...options});
    return new MarsBot(game, game.marsBotPlayer!, human, THARSIS_MARSBOT_BOARD, new SeededRandom(0));
  }

  it('gains M€, and loses no more than it has', () => {
    const gained = 4;
    const marsBot = newMarsBot();

    marsBot.gainMc(gained);
    marsBot.gainMc(-1);

    expect(marsBot.megacredits).eq(gained);
    expect(marsBot.loseMc(gained + 3)).eq(gained);
    expect(marsBot.megacredits).eq(0);
  });

  it('raises and lowers its TR', () => {
    const marsBot = newMarsBot();
    const tr = marsBot.player.terraformRating;

    marsBot.raiseTR(3);
    marsBot.raiseTR(-1);

    expect(marsBot.player.terraformRating).eq(tr + 2);
  });

  for (const run of [
    {options: {venusNextExtension: true}, floaters: 2, titan: 0},
    {options: {coloniesExtension: true}, floaters: 0, titan: 2},
    {options: {venusNextExtension: true, coloniesExtension: true}, floaters: 2, titan: 0},
  ]) {
    it(`keeps floaters where the expansions put them, ${JSON.stringify(run)}`, () => {
      const marsBot = newMarsBot(run.options);

      marsBot.addFloaters(3);
      marsBot.spendFloaters(1);

      expect(marsBot.floaters).eq(run.floaters);
      expect(marsBot.shippingBoard.get(ColonyName.TITAN)).eq(run.titan);
    });
  }

  for (const run of [
    {temperature: -30, steps: 2, raises: 2},
    {temperature: 6, steps: 2, raises: 1},
    {temperature: 8, steps: 1, raises: 0},
  ] as const) {
    it(`counts the temperature steps it raises, ${JSON.stringify(run)}`, () => {
      const marsBot = newMarsBot();
      setTemperature(marsBot.game, run.temperature);

      marsBot.raiseTemperature(run.steps);

      expect(marsBot.temperatureRaises).eq(run.raises);
    });
  }

  for (const run of [
    {temperature: -30, raisedTemperature: -28, raisedOxygen: 0}, // 19 temperature steps left, 14 oxygen
    {temperature: 0, raisedTemperature: 0, raisedOxygen: 1}, // 4 temperature steps left, 14 oxygen
  ]) {
    it(`raises the parameter furthest from completion, ${JSON.stringify(run)}`, () => {
      const marsBot = newMarsBot();
      setTemperature(marsBot.game, run.temperature);

      expect(marsBot.advanceFurthestParameter(BonusCardName.LOBBYISTS)).is.true;

      expect(marsBot.game.getTemperature()).eq(run.raisedTemperature);
      expect(marsBot.game.getOxygenLevel()).eq(run.raisedOxygen);
    });
  }

  it('places a greenery and raises the oxygen', () => {
    const marsBot = newMarsBot();

    expect(marsBot.maybePlaceGreenery()).is.true;

    expect(marsBot.game.board.getGreeneries(marsBot.player)).has.length(1);
    expect(marsBot.game.getOxygenLevel()).eq(1);
  });

  it('places a greenery only where the filter accepts', () => {
    const marsBot = newMarsBot();

    expect(marsBot.maybePlaceGreenery(() => false)).is.false;

    expect(marsBot.game.board.getGreeneries(marsBot.player)).is.empty;
  });

  it('scores an award by its MarsBot rule, else as a player would', () => {
    const marsBot = newMarsBot();
    marsBot.marsBotBoard.tracks[0].position = 3;
    marsBot.maybePlaceGreenery();

    expect(marsBot.awardValue(new Banker())).eq(3);
    expect(marsBot.awardValue(new Landlord())).eq(1);
  });

  it('gives back TR and M€ gained under Government Intervention, keeping what it may keep', () => {
    const megacredits = 4;
    const kept = 2;
    const marsBot = newMarsBot();
    marsBot.megacredits = megacredits;
    const tr = marsBot.player.terraformRating;

    marsBot.withoutTRorMcGain(() => {
      marsBot.raiseTR(1);
      marsBot.gainMc(5);
      marsBot.mcKeptThroughIntervention = kept;
    });

    expect(marsBot.player.terraformRating).eq(tr);
    expect(marsBot.megacredits).eq(megacredits + kept);
    expect(marsBot.mcKeptThroughIntervention).is.undefined;
  });

  it('resolves a bonus card by name', () => {
    const marsBot = newMarsBot();
    const tr = marsBot.player.terraformRating;

    marsBot.resolveBonusCard(BonusCardName.GOVERNMENT_SUBSIDY);

    expect(marsBot.player.terraformRating).eq(tr + 1);
  });

  for (const run of [
    {card: BonusCardName.GOVERNMENT_SUBSIDY, plants: 0, destroyed: 0, discardPile: [BonusCardName.GOVERNMENT_SUBSIDY]},
    // Meteor Shower is destroyed when the player loses 3 plants or more
    {card: BonusCardName.METEOR_SHOWER, plants: 5, destroyed: 1, discardPile: []},
  ]) {
    it(`discards the bonus card it draws, or counts it destroyed, ${JSON.stringify(run)}`, () => {
      const marsBot = newMarsBot();
      marsBot.bonusDeck.drawPile = [createBonusCard(run.card)];
      marsBot.humanPlayer.plants = run.plants;

      marsBot.maybeDrawAndResolveBonusCard();

      expect(marsBot.destroyedBonusCards).eq(run.destroyed);
      expect(marsBot.bonusDeck.serialize()).deep.eq({drawPile: [], discardPile: run.discardPile});
    });
  }

  it('puts a bonus card at the bottom of the bonus deck', () => {
    const marsBot = newMarsBot();
    marsBot.bonusDeck.drawPile = [createBonusCard(BonusCardName.METEOR_SHOWER)];

    marsBot.addBonusCardToBottomOfBonusDeck(BonusCardName.INVESTORS);

    expect(marsBot.bonusDeck.serialize().drawPile).deep.eq([BonusCardName.INVESTORS, BonusCardName.METEOR_SHOWER]);
  });

  it('keeps corp state, 0 until set', () => {
    const marsBot = newMarsBot();

    expect(marsBot.getCorpState('plantResources')).eq(0);
    marsBot.setCorpState('plantResources', 2);
    expect(marsBot.getCorpState('plantResources')).eq(2);
  });

  it('leaves a track at its end where it is', () => {
    const marsBot = newMarsBot();
    const track = marsBot.marsBotBoard.tracks[0];
    const end = track.definition.layout.length - 1;
    track.position = end;

    marsBot.maybeAdvanceTrack(0);

    expect(track.position).eq(end);
  });

  it('throws for a member whose logic is still in review', () => {
    const marsBot = newMarsBot();

    expect(() => marsBot.maybeAdvanceTrack(0)).to.throw(/TODO\(ignac8\)/);
  });
});
