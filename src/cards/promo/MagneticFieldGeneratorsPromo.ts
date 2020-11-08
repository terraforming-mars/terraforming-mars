import { Player } from "../../Player";
import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Resources } from "../../Resources";
import { CardName } from "../../CardName";
import { Game } from "../../Game";
import { SelectSpace } from "../../inputs/SelectSpace";
import { TileType } from "../../TileType";
import { ISpace } from "../../ISpace";
import { PartyHooks } from "../../turmoil/parties/PartyHooks";
import { PartyName } from "../../turmoil/parties/PartyName";
import { REDS_RULING_POLICY_COST } from "../../constants";

export class MagneticFieldGeneratorsPromo implements IProjectCard {
    public cost = 22;
    public tags = [Tags.STEEL];
    public name = CardName.MAGNETIC_FIELD_GENERATORS_PROMO;
    public cardType = CardType.AUTOMATED;
    public hasRequirements = false;
    public canPlay(player: Player, game: Game): boolean {
        const meetsEnergyRequirements = player.getProduction(Resources.ENERGY) >= 4;
        const canPlaceTile = game.board.getAvailableSpacesOnLand(player).length > 0;

        if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
            return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST * 3, game, true) && meetsEnergyRequirements && canPlaceTile;
        }

        return meetsEnergyRequirements && canPlaceTile;
    }
    public play(player: Player, game: Game) {
        player.addProduction(Resources.ENERGY,-4);
        player.addProduction(Resources.PLANTS,2);
        player.increaseTerraformRatingSteps(3, game);

        const availableSpaces = game.board.getAvailableSpacesOnLand(player);
        if (availableSpaces.length < 1) return undefined;
        
        return new SelectSpace("Select space for tile", availableSpaces, (foundSpace: ISpace) => {
            game.addTile(player, foundSpace.spaceType, foundSpace, { tileType: TileType.MAGNETIC_FIELD_GENERATORS });
            return undefined;
        });
    }
} 
