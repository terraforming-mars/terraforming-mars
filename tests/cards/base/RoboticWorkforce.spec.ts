import {expect} from 'chai';
import {CardName} from '../../../src/CardName';
import {ALL_CARD_MANIFESTS} from '../../../src/cards/AllCards';
import {CapitalAres} from '../../../src/cards/ares/CapitalAres';
import {SolarFarm} from '../../../src/cards/ares/SolarFarm';
import {BiomassCombustors} from '../../../src/cards/base/BiomassCombustors';
import {Capital} from '../../../src/cards/base/Capital';
import {FoodFactory} from '../../../src/cards/base/FoodFactory';
import {NoctisFarming} from '../../../src/cards/base/NoctisFarming';
import {RoboticWorkforce} from '../../../src/cards/base/RoboticWorkforce';
import {CardType} from '../../../src/cards/CardType';
import {ResearchCoordination} from '../../../src/cards/prelude/ResearchCoordination';
import {UtopiaInvest} from '../../../src/cards/turmoil/UtopiaInvest';
import {Tags} from '../../../src/cards/Tags';
import {Game} from '../../../src/Game';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {SpaceBonus} from '../../../src/SpaceBonus';
import {ARES_OPTIONS_NO_HAZARDS} from '../../ares/AresTestHelper';
import {TestingUtils, setCustomGameOptions, TestPlayers} from '../../TestingUtils';
import {staticCardProperties} from '../../../src/cards/Card';
import {TileType} from '../../../src/TileType';
import {ICard} from '../../../src/cards/ICard';

describe('RoboticWorkforce', function() {
  let card : RoboticWorkforce; let player : Player; let game : Game;
  let redPlayer: Player;

  beforeEach(function() {
    card = new RoboticWorkforce();
    player = TestPlayers.BLUE.newPlayer();
    redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player, setCustomGameOptions({moonExpansion: true}));
  });

  it('Can\'t play if no building cards to copy', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should throw', function() {
    player.playedCards.push(new FoodFactory(), new BiomassCombustors(), card);
    expect(card.canPlay(player)).is.not.true;
    const action = card.play(player);
    expect(action).is.undefined;
  });

  it('Should play', function() {
    const noctisFarming = new NoctisFarming();
    player.playedCards.push(noctisFarming);

    const action = card.play(player);
    expect(action).is.not.undefined;
    action!.cb([noctisFarming]);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
  });

  it('Should work with capital', function() {
    const capital = new Capital();
    player.playedCards.push(capital);

    const action = card.play(player);
    expect(action).is.undefined; // Not enough energy production

    player.addProduction(Resources.ENERGY, 2);
    const selectCard = card.play(player);
    expect(selectCard).is.not.undefined;
    selectCard!.cb([capital]);
    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(5);
  });

  it('Should work with Capital (Ares expansion)', function() {
    game = Game.newInstance('foobar', [player, redPlayer], player, ARES_OPTIONS_NO_HAZARDS);
    const capitalAres = new CapitalAres();
    player.playedCards.push(capitalAres);

    const action = card.play(player);
    expect(action).is.undefined; // Not enough energy production

    player.addProduction(Resources.ENERGY, 2);
    const selectCard = card.play(player);
    expect(selectCard).is.not.undefined;
    selectCard!.cb([capitalAres]);
    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(5);
  });

  it('Should work with Solar Farm (Ares expansion)', function() {
    game = Game.newInstance('foobar', [player, redPlayer], player, ARES_OPTIONS_NO_HAZARDS);
    const solarFarm = new SolarFarm();

    // This space should have 2 plants bonus on default map
    const solarFarmSpace = game.board.getAvailableSpacesOnLand(player)[18];
    expect(solarFarmSpace.bonus).has.lengthOf(2);
    expect(solarFarmSpace.bonus.every((b) => b === SpaceBonus.PLANT)).is.true;

    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    const action = solarFarm.play(player);
    expect(action).is.not.undefined;
    action!.cb(solarFarmSpace);
    expect(player.getProduction(Resources.ENERGY)).to.eq(2);

    player.playedCards.push(solarFarm);

    const selectCard = card.play(player);
    expect(selectCard).is.not.undefined;
    selectCard!.cb([solarFarm]);
    expect(player.getProduction(Resources.ENERGY)).to.eq(4);
  });

  it('Should play with corporation cards', function() {
    const corporationCard = new UtopiaInvest();
    player.corporationCard = corporationCard;

    const action = card.play(player);
    expect(action).is.not.undefined;

    expect(player.getProduction(Resources.STEEL)).to.eq(0);
    expect(player.getProduction(Resources.TITANIUM)).to.eq(0);
    action!.cb([corporationCard as any]);
    expect(player.getProduction(Resources.STEEL)).to.eq(1);
    expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
  });

  it('Has all building cards set up', function() {
    ALL_CARD_MANIFESTS.forEach((manifest) => {
      manifest.projectCards.factories.forEach((c) => {
        testCard(new c.Factory());
      });
      manifest.preludeCards.factories.forEach((c) => {
        testCard(new c.Factory());
      });
      manifest.corporationCards.factories.forEach((c) => {
        testCard(new c.Factory());
      });
    });
  });

  it('all cards have updaters or productionBoxes', () => {
    const errors: Array<string> = [];
    RoboticWorkforce.builderCardsNames.forEach((cardName) => {
      const updater = card.getUpdater(cardName, player);
      const units = staticCardProperties.get(cardName)?.productionBox;
      if (updater === undefined && units === undefined) {
        errors.push(cardName + ' is unregistered');
      }
      if (updater !== undefined && units !== undefined) {
        errors.push(cardName + ' is double-registered');
      }
    });
    expect(errors, errors.toString()).is.empty;
  });

  const testCard = function(card: ICard) {
    const researchCoordination = new ResearchCoordination();
    const gameOptions = setCustomGameOptions({moonExpansion: true});
    const productions = [Resources.MEGACREDITS, Resources.STEEL, Resources.TITANIUM, Resources.PLANTS, Resources.ENERGY, Resources.HEAT];

    if ((card.tags.includes(Tags.BUILDING) || card.tags.includes(Tags.WILDCARD)) && card.play !== undefined) {
    // Solar Farm is a pain to test so let's just say it's fine
      if (card.name === CardName.SOLAR_FARM) {
        return;
      }

      // Create new players, set all productions to 2 and place some tiles
      player = TestPlayers.BLUE.newPlayer();
      redPlayer = TestPlayers.RED.newPlayer();
      game = Game.newInstance('foobar', [player, redPlayer], player, gameOptions);
      TestingUtils.resetBoard(game);
      game.addCityTile(player, '17');
      game.addCityTile(player, '19');
      game.addOceanTile(player, '32');
      game.addOceanTile(player, '33');
      game.addOceanTile(player, '34');
      for (const prod of productions) {
        player.addProduction(prod, 2);
        expect(player.getProduction(prod)).to.eq(2);
      }

      expect(game.deferredActions).has.lengthOf(0);

      // Let's make sure we trigger any tag based production
      player.playedCards.push(...Array(5).fill(researchCoordination));

      if (card.name === CardName.LUNAR_MINE_URBANIZATION) {
      game.moonData!.moon.spaces[4].tile = {tileType: TileType.MOON_MINE};
      game.moonData!.moon.spaces[4].player = player;
      }

      const action = card.play(player);
      if (action !== undefined) {
        if (action instanceof SelectSpace) {
          action.cb(action.availableSpaces[0]);
        }
      }

      while (game.deferredActions.length) {
        const defAction = game.deferredActions.pop()!.execute();
        if (defAction !== undefined) {
          if (defAction instanceof SelectSpace) {
            defAction.cb(defAction.availableSpaces[0]);
          }
        }
      }

      // Now if any of the production changed, that means the card has a production box
      if (productions.filter((prod) => player.getProduction(prod) !== 2).length > 0) {
        if (card.cardType === CardType.CORPORATION) {
          expect(RoboticWorkforce.corporationCardsNames.includes(card.name), card.name + ' is missing in corporationCardsNames').is.true;
        } else {
          expect(RoboticWorkforce.builderCardsNames.includes(card.name), card.name + ' is missing in builderCardsNames').is.true;
        }
      } else {
        if (card.cardType === CardType.CORPORATION) {
          expect(RoboticWorkforce.corporationCardsNames.includes(card.name), card.name + ' is mistakenly included in corporationCardsNames').is.false;
        } else {
          expect(RoboticWorkforce.builderCardsNames.includes(card.name), card.name + ' is mistakenly included in builderCardsNames').is.false;
        }
      }
    } else {
      if (card.cardType === CardType.CORPORATION) {
        expect(RoboticWorkforce.corporationCardsNames.includes(card.name), card.name + ' is mistakenly included in corporationCardsNames').is.false;
      } else {
        expect(RoboticWorkforce.builderCardsNames.includes(card.name), card.name + ' is mistakenly included in builderCardsNames').is.false;
      }
    }
  };
});
