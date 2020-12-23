import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {SelectCard} from '../../inputs/SelectCard';
import {CardName} from '../../CardName';
import {Resources} from '../../Resources';
import {ICard} from '../ICard';
import {DecreaseAnyProduction} from '../../deferredActions/DecreaseAnyProduction';
import {SpaceBonus} from '../../SpaceBonus';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class RoboticWorkforce implements IProjectCard {
  public cost = 9;
  public tags = [Tags.SCIENCE];
  public name = CardName.ROBOTIC_WORKFORCE;
  public cardType = CardType.AUTOMATED;
  public hasRequirements = false;
  public canPlay(player: Player, game: Game): boolean {
    return this.getAvailableCards(player, game).length > 0;
  }
  private miningSteelProduction: number = 0;
  private miningTitaniumProduction: number = 0;
  private solarFarmEnergyProduction: number = 0;

  // Made public for availability in tests
  public builderCardsNames: ReadonlyArray<CardName> = [
    CardName.AI_CENTRAL,
    CardName.ASTEROID_DEFLECTION_SYSTEM,
    CardName.BIOFERTILIZER_FACILITY,
    CardName.BIOMASS_COMBUSTORS,
    CardName.BUILDING_INDUSTRIES,
    CardName.CAPITAL,
    CardName.CAPITAL_ARES,
    CardName.CARBONATE_PROCESSING,
    CardName.COMMERCIAL_DISTRICT,
    CardName.COMMERCIAL_DISTRICT_ARES,
    CardName.CORPORATE_STRONGHOLD,
    CardName.CULTURAL_METROPOLIS,
    CardName.CUPOLA_CITY,
    CardName.DEEP_WELL_HEATING,
    CardName.DOMED_CRATER,
    CardName.DOME_FARMING,
    CardName.EARLY_SETTLEMENT,
    CardName.ELECTRO_CATAPULT,
    CardName.EOS_CHASMA_NATIONAL_PARK,
    CardName.FIELD_CAPPED_CITY,
    CardName.FOOD_FACTORY,
    CardName.FUELED_GENERATORS,
    CardName.FUEL_FACTORY,
    CardName.FUSION_POWER,
    CardName.GEOTHERMAL_POWER,
    CardName.GHG_FACTORIES,
    CardName.GREAT_DAM,
    CardName.GREAT_DAM_PROMO,
    CardName.GYROPOLIS,
    CardName.HEAT_TRAPPERS,
    CardName.HOUSE_PRINTING,
    CardName.IMMIGRANT_CITY,
    CardName.INDUSTRIAL_MICROBES,
    CardName.LAVA_TUBE_SETTLEMENT,
    CardName.MAGNETIC_FIELD_DOME,
    CardName.MAGNETIC_FIELD_GENERATORS,
    CardName.MAGNETIC_FIELD_GENERATORS_PROMO,
    CardName.MARTIAN_INDUSTRIES,
    CardName.MARTIAN_MEDIA_CENTER,
    CardName.MEDICAL_LAB,
    CardName.MINE,
    CardName.MINING_AREA,
    CardName.MINING_AREA_ARES,
    CardName.MINING_OPERATIONS,
    CardName.MINING_QUOTA,
    CardName.MINING_RIGHTS,
    CardName.MINING_RIGHTS_ARES,
    CardName.MOHOLE,
    CardName.MOHOLE_AREA,
    CardName.MOHOLE_AREA_ARES,
    CardName.MOHOLE_EXCAVATION,
    CardName.NATURAL_PRESERVE,
    CardName.NATURAL_PRESERVE_ARES,
    CardName.NOCTIS_CITY,
    CardName.NOCTIS_FARMING,
    CardName.NUCLEAR_POWER,
    CardName.OCEAN_CITY,
    CardName.OCEAN_FARM,
    CardName.OPEN_CITY,
    CardName.PARLIAMENT_HALL,
    CardName.PEROXIDE_POWER,
    CardName.POLAR_INDUSTRIES,
    CardName.POWER_PLANT,
    CardName.PROTECTED_VALLEY,
    CardName.RAD_CHEM_FACTORY,
    CardName.SELF_SUFFICIENT_SETTLEMENT,
    CardName.SOIL_FACTORY,
    CardName.SOLAR_FARM,
    CardName.SOLAR_POWER,
    CardName.SPACE_ELEVATOR,
    CardName.SPACE_PORT,
    CardName.SPINOFF_DEPARTMENT,
    CardName.SPONSORED_MOHOLE,
    CardName.STRIP_MINE,
    CardName.TECTONIC_STRESS_POWER,
    CardName.TITANIUM_MINE,
    CardName.TROPICAL_RESORT,
    CardName.UNDERGROUND_CITY,
    CardName.URBANIZED_AREA,
    CardName.WINDMILLS,
  ];

  // Made public for availability in tests
  public corporationCardsNames: ReadonlyArray<CardName> = [
    CardName.CHEUNG_SHING_MARS,
    CardName.FACTORUM,
    CardName.MANUTECH,
    CardName.MINING_GUILD,
    CardName.RECYCLON,
    CardName.UTOPIA_INVEST,
  ];

  private getAvailableCards(player: Player, game: Game): Array<ICard> {
    const availableCards: Array<ICard> = player.playedCards.filter((card) => {
      if (card.name === CardName.BIOMASS_COMBUSTORS) {
        if (game.someoneHasResourceProduction(Resources.PLANTS, 1)) {
          return true;
        }
      } else if (card.name === CardName.MAGNETIC_FIELD_GENERATORS || card.name === CardName.MAGNETIC_FIELD_GENERATORS_PROMO) {
        if (player.getProduction(Resources.ENERGY) >= 4) {
          return true;
        }
      } else if (card.name === CardName.TROPICAL_RESORT) {
        if (player.getProduction(Resources.HEAT) >= 2) {
          return true;
        }
      } else if (card.name === CardName.CAPITAL ||
        card.name === CardName.CAPITAL_ARES ||
        card.name === CardName.GYROPOLIS ||
        card.name === CardName.MAGNETIC_FIELD_DOME ||
        card.name === CardName.STRIP_MINE ||
        card.name === CardName.UNDERGROUND_CITY
      ) {
        if (player.getProduction(Resources.ENERGY) >= 2) {
          return true;
        }
      } else if (card.name === CardName.AI_CENTRAL ||
        card.name === CardName.ASTEROID_DEFLECTION_SYSTEM ||
        card.name === CardName.BUILDING_INDUSTRIES ||
        card.name === CardName.CARBONATE_PROCESSING ||
        card.name === CardName.COMMERCIAL_DISTRICT ||
        card.name === CardName.COMMERCIAL_DISTRICT_ARES ||
        card.name === CardName.CORPORATE_STRONGHOLD ||
        card.name === CardName.CULTURAL_METROPOLIS ||
        card.name === CardName.CUPOLA_CITY ||
        card.name === CardName.DOMED_CRATER ||
        card.name === CardName.ELECTRO_CATAPULT ||
        card.name === CardName.FUEL_FACTORY ||
        card.name === CardName.GHG_FACTORIES ||
        card.name === CardName.IMMIGRANT_CITY ||
        card.name === CardName.LAVA_TUBE_SETTLEMENT ||
        card.name === CardName.NOCTIS_CITY ||
        card.name === CardName.OCEAN_CITY ||
        card.name === CardName.OPEN_CITY ||
        card.name === CardName.RAD_CHEM_FACTORY ||
        card.name === CardName.SOIL_FACTORY ||
        card.name === CardName.SPACE_PORT ||
        card.name === CardName.URBANIZED_AREA
      ) {
        if (player.getProduction(Resources.ENERGY) >= 1) {
          return true;
        }
      } else if (card.name === CardName.HEAT_TRAPPERS) {
        if (game.someoneHasResourceProduction(Resources.HEAT, 2)) {
          return true;
        }
      } else if (card.name === CardName.PEROXIDE_POWER || card.name === CardName.FUELED_GENERATORS) {
        if (player.getProduction(Resources.MEGACREDITS) >= -4) {
          return true;
        }
      } else if (card.name === CardName.NUCLEAR_POWER) {
        if (player.getProduction(Resources.MEGACREDITS) >= -3) {
          return true;
        }
      } else if (card.name === CardName.FOOD_FACTORY) {
        if (player.getProduction(Resources.PLANTS) >= 1) {
          return true;
        }
      } else if (this.builderCardsNames.includes(card.name)) {
        return true;
      }
      return false;
    });

    if (player.corporationCard !== undefined && this.corporationCardsNames.includes(player.corporationCard.name)) {
      availableCards.push(player.corporationCard);
    }

    return availableCards;
  }

  public play(player: Player, game: Game) {
    const availableCards = this.getAvailableCards(player, game);

    if (availableCards.length === 0) {
      return undefined;
    }

    return new SelectCard('Select builder card to copy', 'Copy', availableCards, (selectedCards: Array<ICard>) => {
      const foundCard: ICard = selectedCards[0];

      switch (foundCard.name) {
      // this card require additional user input
      case CardName.BIOMASS_COMBUSTORS:
        player.addProduction(Resources.ENERGY, 2);
        game.defer(new DecreaseAnyProduction(player, game, Resources.PLANTS, 1));
        return undefined;

      // this card require additional user input
      case CardName.HEAT_TRAPPERS:
        player.addProduction(Resources.ENERGY, 1);
        game.defer(new DecreaseAnyProduction(player, game, Resources.HEAT, 2));
        return undefined;

      // Mining resource definition
      case CardName.MINING_AREA:
      case CardName.MINING_AREA_ARES:
      case CardName.MINING_RIGHTS:
      case CardName.MINING_RIGHTS_ARES:
        const bonusResource = (foundCard as IProjectCard).bonusResource;
        if (bonusResource !== undefined && bonusResource === Resources.STEEL) {
          this.miningSteelProduction++;
        }
        if (bonusResource !== undefined && bonusResource === Resources.TITANIUM) {
          this.miningTitaniumProduction++;
        }
        break;

      case CardName.SOLAR_FARM:
        const solarFarmSpace = game.board.getSpaceByTileCard(CardName.SOLAR_FARM);
        if (solarFarmSpace !== undefined) {
          this.solarFarmEnergyProduction = solarFarmSpace.bonus.filter((bonus) => bonus === SpaceBonus.PLANT).length;
        }
        break;
      }

      class Updater {
        constructor(
          public name: CardName,
          public energyProduction: number,
          public megaCreditProduction: number,
          public steelProduction: number,
          public titaniumProduction: number,
          public plantProduction: number,
          public heatProduction: number) {}
      }

      const updaters: Array<Updater> = [
        new Updater(CardName.AI_CENTRAL, -1, 0, 0, 0, 0, 0),
        new Updater(CardName.ASTEROID_DEFLECTION_SYSTEM, -1, 0, 0, 0, 0, 0),
        new Updater(CardName.BIOFERTILIZER_FACILITY, 0, 0, 0, 0, 1, 0),
        new Updater(CardName.BUILDING_INDUSTRIES, -1, 0, 2, 0, 0, 0),
        new Updater(CardName.CAPITAL, -2, 5, 0, 0, 0, 0),
        new Updater(CardName.CAPITAL_ARES, -2, 5, 0, 0, 0, 0),
        new Updater(CardName.CARBONATE_PROCESSING, -1, 0, 0, 0, 0, 3),
        new Updater(CardName.CHEUNG_SHING_MARS, 0, 3, 0, 0, 0, 0),
        new Updater(CardName.COMMERCIAL_DISTRICT, -1, 4, 0, 0, 0, 0),
        new Updater(CardName.COMMERCIAL_DISTRICT_ARES, -1, 4, 0, 0, 0, 0),
        new Updater(CardName.CORPORATE_STRONGHOLD, -1, 3, 0, 0, 0, 0),
        new Updater(CardName.CULTURAL_METROPOLIS, -1, 3, 0, 0, 0, 0),
        new Updater(CardName.CUPOLA_CITY, -1, 3, 0, 0, 0, 0),
        new Updater(CardName.DEEP_WELL_HEATING, 1, 0, 0, 0, 0, 0),
        new Updater(CardName.DOMED_CRATER, -1, 3, 0, 0, 0, 0),
        new Updater(CardName.DOME_FARMING, 0, 2, 0, 0, 1, 0),
        new Updater(CardName.EARLY_SETTLEMENT, 0, 0, 0, 0, 1, 0),
        new Updater(CardName.ELECTRO_CATAPULT, -1, 0, 0, 0, 0, 0),
        new Updater(CardName.EOS_CHASMA_NATIONAL_PARK, 2, 0, 0, 0, 0, 0),
        new Updater(CardName.FACTORUM, 0, 0, 1, 0, 0, 0),
        new Updater(CardName.FIELD_CAPPED_CITY, 1, 2, 0, 0, 0, 0),
        new Updater(CardName.FOOD_FACTORY, 0, 4, 0, 0, -1, 0),
        new Updater(CardName.FUELED_GENERATORS, 1, -1, 0, 0, 0, 0),
        new Updater(CardName.FUEL_FACTORY, -1, 1, 0, 1, 0, 0),
        new Updater(CardName.FUSION_POWER, 3, 0, 0, 0, 0, 0),
        new Updater(CardName.GEOTHERMAL_POWER, 2, 0, 0, 0, 0, 0),
        new Updater(CardName.GHG_FACTORIES, -1, 0, 0, 0, 0, 4),
        new Updater(CardName.GREAT_DAM, 2, 0, 0, 0, 0, 0),
        new Updater(CardName.GREAT_DAM_PROMO, 2, 0, 0, 0, 0, 0),
        new Updater(CardName.GYROPOLIS, -2, player.getMultipleTagCount([Tags.VENUS, Tags.EARTH]), 0, 0, 0, 0),
        new Updater(CardName.HOUSE_PRINTING, 0, 0, 1, 0, 0, 0),
        new Updater(CardName.IMMIGRANT_CITY, -1, -2, 0, 0, 0, 0),
        new Updater(CardName.INDUSTRIAL_MICROBES, 1, 0, 1, 0, 0, 0),
        new Updater(CardName.LAVA_TUBE_SETTLEMENT, -1, 2, 0, 0, 0, 0),
        new Updater(CardName.MAGNETIC_FIELD_DOME, -2, 0, 0, 0, 1, 0),
        new Updater(CardName.MAGNETIC_FIELD_GENERATORS, -4, 0, 0, 0, 2, 0),
        new Updater(CardName.MAGNETIC_FIELD_GENERATORS_PROMO, -4, 0, 0, 0, 2, 0),
        new Updater(CardName.MANUTECH, 0, 0, 1, 0, 0, 0),
        new Updater(CardName.MARTIAN_INDUSTRIES, 1, 0, 1, 0, 0, 0),
        new Updater(CardName.MARTIAN_MEDIA_CENTER, 0, 2, 0, 0, 0, 0),
        new Updater(CardName.MEDICAL_LAB, 0, Math.floor(player.getTagCount(Tags.STEEL) / 2), 0, 0, 0, 0),
        new Updater(CardName.MINE, 0, 0, 1, 0, 0, 0),
        new Updater(CardName.MINING_AREA, 0, 0, this.miningSteelProduction, this.miningTitaniumProduction, 0, 0),
        new Updater(CardName.MINING_AREA_ARES, 0, 0, this.miningSteelProduction, this.miningTitaniumProduction, 0, 0),
        new Updater(CardName.MINING_GUILD, 0, 0, 1, 0, 0, 0),
        new Updater(CardName.MINING_OPERATIONS, 0, 0, 2, 0, 0, 0),
        new Updater(CardName.MINING_QUOTA, 0, 0, 2, 0, 0, 0),
        new Updater(CardName.MINING_RIGHTS, 0, 0, this.miningSteelProduction, this.miningTitaniumProduction, 0, 0),
        new Updater(CardName.MINING_RIGHTS_ARES, 0, 0, this.miningSteelProduction, this.miningTitaniumProduction, 0, 0),
        new Updater(CardName.MOHOLE, 0, 0, 0, 0, 0, 3),
        new Updater(CardName.MOHOLE_AREA, 0, 0, 0, 0, 0, 4),
        new Updater(CardName.MOHOLE_AREA_ARES, 0, 0, 0, 0, 0, 4),
        new Updater(CardName.MOHOLE_EXCAVATION, 0, 0, 1, 0, 0, 2),
        new Updater(CardName.NATURAL_PRESERVE, 1, 0, 0, 0, 0, 0),
        new Updater(CardName.NATURAL_PRESERVE_ARES, 1, 0, 0, 0, 0, 0),
        new Updater(CardName.NOCTIS_CITY, -1, 3, 0, 0, 0, 0),
        new Updater(CardName.NOCTIS_FARMING, 0, 1, 0, 0, 0, 0),
        new Updater(CardName.NUCLEAR_POWER, 3, -2, 0, 0, 0, 0),
        new Updater(CardName.OCEAN_CITY, -1, 3, 0, 0, 0, 0),
        new Updater(CardName.OCEAN_FARM, 0, 0, 0, 0, 1, 1),
        new Updater(CardName.OPEN_CITY, -1, 4, 0, 0, 0, 0),
        new Updater(CardName.PARLIAMENT_HALL, 0, Math.floor(player.getTagCount(Tags.STEEL) / 3), 0, 0, 0, 0),
        new Updater(CardName.PEROXIDE_POWER, 2, -1, 0, 0, 0, 0),
        new Updater(CardName.POLAR_INDUSTRIES, 0, 0, 0, 0, 0, 2),
        new Updater(CardName.POWER_PLANT, 1, 0, 0, 0, 0, 0),
        new Updater(CardName.PROTECTED_VALLEY, 0, 2, 0, 0, 0, 0),
        new Updater(CardName.RAD_CHEM_FACTORY, -1, 0, 0, 0, 0, 0),
        new Updater(CardName.RECYCLON, 0, 0, 1, 0, 0, 0),
        new Updater(CardName.SELF_SUFFICIENT_SETTLEMENT, 0, 2, 0, 0, 0, 0),
        new Updater(CardName.SOIL_FACTORY, -1, 0, 0, 0, 1, 0),
        new Updater(CardName.SOLAR_FARM, this.solarFarmEnergyProduction, 0, 0, 0, 0, 0),
        new Updater(CardName.SOLAR_POWER, 1, 0, 0, 0, 0, 0),
        new Updater(CardName.SPACE_ELEVATOR, 0, 0, 0, 1, 0, 0),
        new Updater(CardName.SPACE_PORT, -1, 4, 0, 0, 0, 0),
        new Updater(CardName.SPINOFF_DEPARTMENT, 0, 2, 0, 0, 0, 0),
        new Updater(CardName.SPONSORED_MOHOLE, 0, 0, 0, 0, 0, 2),
        new Updater(CardName.STRIP_MINE, -2, 0, 2, 1, 0, 0),
        new Updater(CardName.TECTONIC_STRESS_POWER, 3, 0, 0, 0, 0, 0),
        new Updater(CardName.TITANIUM_MINE, 0, 0, 0, 1, 0, 0),
        new Updater(CardName.TROPICAL_RESORT, 0, 3, 0, 0, 0, -2),
        new Updater(CardName.UNDERGROUND_CITY, -2, 0, 2, 0, 0, 0),
        new Updater(CardName.URBANIZED_AREA, -1, 2, 0, 0, 0, 0),
        new Updater(CardName.UTOPIA_INVEST, 0, 0, 1, 1, 0, 0),
        new Updater(CardName.WINDMILLS, 1, 0, 0, 0, 0, 0),
      ];

      const result:Updater = updaters.filter((u) => u.name === foundCard.name)[0];

      if (!result) {
        throw 'Production not found for selected card';
      }

      if (player.getProduction(Resources.ENERGY) + result.energyProduction < 0) {
        throw 'not enough energy production';
      }
      if (player.getProduction(Resources.TITANIUM) + result.titaniumProduction < 0) {
        throw 'not enough titanium production';
      }
      if (player.getProduction(Resources.PLANTS) + result.plantProduction < 0) {
        throw 'not enough plant production';
      }
      if (player.getProduction(Resources.HEAT) + result.heatProduction < 0) {
        throw 'not enough heat production';
      }

      player.addProduction(Resources.ENERGY, result.energyProduction);
      player.addProduction(Resources.MEGACREDITS, result.megaCreditProduction);
      player.addProduction(Resources.STEEL, result.steelProduction);
      player.addProduction(Resources.TITANIUM, result.titaniumProduction);
      player.addProduction(Resources.PLANTS, result.plantProduction);
      player.addProduction(Resources.HEAT, result.heatProduction);

      game.log('${0} copied ${1} production with ${2}', (b) =>
        b.player(player).cardName(result.name).card(this));

      return undefined;
    });
  }
  public metadata: CardMetadata = {
    cardNumber: '086',
    renderData: CardRenderer.builder((b) => {
      b.productionBox((pb) => pb.building().played);
    }),
    description: 'Duplicate only the production box of one of your building cards.',
  }
}
