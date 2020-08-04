import { SpaceBonus } from "./SpaceBonus";
import { SpaceName } from "./SpaceName";
import { Board, Land, BoardColony } from "./Board";
import { Player } from "./Player";
import { ISpace } from "./ISpace";
import { HELLAS_BONUS_OCEAN_COST } from "./constants";
import { SpaceType } from "./SpaceType";

export class HellasBoard extends Board{
    constructor(shuffleMapOption: boolean = false, seed: number = 0) {
        super();
        this.seed = Math.floor(seed * 4294967296)
        this.spaces.push(new BoardColony(SpaceName.GANYMEDE_COLONY));
        this.spaces.push(new BoardColony(SpaceName.PHOBOS_SPACE_HAVEN));

        let is_ocean = [];
        let bonus = [];
        // y=0
        is_ocean.push(true, false, false, false, false);
        bonus.push([SpaceBonus.PLANT, SpaceBonus.PLANT], [SpaceBonus.PLANT, SpaceBonus.PLANT], [SpaceBonus.PLANT, SpaceBonus.PLANT], [SpaceBonus.PLANT, SpaceBonus.STEEL], [SpaceBonus.PLANT]);
        // y=1
        is_ocean.push(true, false, false, false, false, false);
        bonus.push([SpaceBonus.PLANT, SpaceBonus.PLANT],
            [SpaceBonus.PLANT, SpaceBonus.PLANT],
            [SpaceBonus.PLANT, SpaceBonus.STEEL],
            [SpaceBonus.PLANT],
            [SpaceBonus.PLANT],
            [SpaceBonus.PLANT]);

        // y=2
        is_ocean.push(true, false, false, false, false, false, false);
        bonus.push([SpaceBonus.PLANT],
            [SpaceBonus.PLANT],
            [SpaceBonus.STEEL],
            [SpaceBonus.STEEL],
            [],
            [SpaceBonus.PLANT, SpaceBonus.PLANT],
            [SpaceBonus.PLANT, SpaceBonus.DRAW_CARD]);

        // y=3
        is_ocean.push(true, false, false, false, false, true, true, false);
        bonus.push(
            [SpaceBonus.PLANT],
            [SpaceBonus.PLANT],
            [SpaceBonus.STEEL],
            [SpaceBonus.STEEL, SpaceBonus.STEEL],
            [SpaceBonus.STEEL],
            [SpaceBonus.PLANT],
            [SpaceBonus.PLANT],
            [SpaceBonus.PLANT],
        );
        // y=4
        is_ocean.push(false, false, false, false, false, true, true, true, false);
        bonus.push(
            [SpaceBonus.DRAW_CARD],
            [],
            [],
            [SpaceBonus.STEEL, SpaceBonus.STEEL],
            [],
            [SpaceBonus.DRAW_CARD],
            [SpaceBonus.HEAT, SpaceBonus.HEAT, SpaceBonus.HEAT],
            [],
            [SpaceBonus.PLANT],
        );
        // y=5
        is_ocean.push(false, false, false, false, false, true, true, false);
        bonus.push(
            [SpaceBonus.TITANIUM],
            [],
            [SpaceBonus.STEEL],
            [],
            [],
            [],
            [SpaceBonus.STEEL],
            [],
        );
        //y=6
        is_ocean.push(true, false, false, false, false, false, false);
        bonus.push([SpaceBonus.TITANIUM, SpaceBonus.TITANIUM],
            [],
            [],
            [SpaceBonus.DRAW_CARD],
            [],
            [],
            [SpaceBonus.TITANIUM]);
        //y=7
        is_ocean.push(false, false, false, false, false, false);
        bonus.push([SpaceBonus.STEEL],
            [SpaceBonus.DRAW_CARD],
            [SpaceBonus.HEAT, SpaceBonus.HEAT],
            [SpaceBonus.HEAT, SpaceBonus.HEAT],
            [SpaceBonus.TITANIUM],
            [SpaceBonus.TITANIUM]);
        // y=8
        is_ocean.push(false, false, 
            false, false);
        bonus.push(
            [], [SpaceBonus.HEAT, SpaceBonus.HEAT], 
            [SpaceBonus.HEAT, SpaceBonus.HEAT], []);
        
        if (shuffleMapOption) {
            this.shuffleArray(is_ocean);
            this.shuffleArray(bonus);
        }

        let idx = 3, me_id = 0;
        
        let pos_x = 4, pos_y=0;
        for (let i = 0; i < 5; ++i) {
            this.spaces.push(this.newTile(idx++, pos_x++, pos_y, is_ocean[me_id], bonus[me_id]));
            me_id++;
        }

        pos_x = 3; pos_y=1;

        for (let i = 0; i < 6; ++i) {
            this.spaces.push(this.newTile(idx++, pos_x++, pos_y, is_ocean[me_id], bonus[me_id]));
            me_id++;
        }
        
        pos_x = 2; pos_y = 2;
        for (let i = 0; i < 7; ++i) {
            this.spaces.push(this.newTile(idx++, pos_x++, pos_y, is_ocean[me_id], bonus[me_id]));
            me_id++;
        }

        pos_x = 1; pos_y=3;

        for (let i = 0; i < 8; ++i) {
            this.spaces.push(this.newTile(idx++, pos_x++, pos_y, is_ocean[me_id], bonus[me_id]));
            me_id++;
        }

        pos_x = 0; pos_y=4;

        for (let i = 0; i < 9; ++i) {
            this.spaces.push(this.newTile(idx++, pos_x++, pos_y, is_ocean[me_id], bonus[me_id]));
            me_id++;
        }

        pos_x = 1; pos_y=5;

        for (let i = 0; i < 8; ++i) {
            this.spaces.push(this.newTile(idx++, pos_x++, pos_y, is_ocean[me_id], bonus[me_id]));
            me_id++;
        }

        pos_x = 2; pos_y=6;

        for (let i = 0; i < 7; ++i) {
            this.spaces.push(this.newTile(idx++, pos_x++, pos_y, is_ocean[me_id], bonus[me_id]));
            me_id++;
        }

        pos_x = 3; pos_y=7;

        for (let i = 0; i < 6; ++i) {
            this.spaces.push(this.newTile(idx++, pos_x++, pos_y, is_ocean[me_id], bonus[me_id]));
            me_id++;
        }

        pos_x = 4; pos_y=8;

        for (let i = 0; i < 2; ++i) {
            this.spaces.push(this.newTile(idx++, pos_x++, pos_y, is_ocean[me_id], bonus[me_id]));
            me_id++;
        }
        this.spaces.push(new Land(idx++, pos_x++, pos_y, [SpaceBonus.OCEAN]))
        for (let i = 0; i < 2; ++i) {
            this.spaces.push(this.newTile(idx++, pos_x++, pos_y, is_ocean[me_id], bonus[me_id]));
            me_id++;
        }

        this.spaces.push(new BoardColony(SpaceName.STANFORD_TORUS));
    }
    
    public getSpaces(spaceType: SpaceType, player: Player): Array<ISpace> {
        // Check for special tile
        if (player.canAfford(HELLAS_BONUS_OCEAN_COST)) return this.spaces.filter((space) => space.spaceType === spaceType);

        return super.getSpaces(spaceType, player).filter((space) => space.id !== SpaceName.HELLAS_OCEAN_TILE);
    }

    public getAvailableSpacesForCity(player: Player): Array<ISpace> {
        // Check for special tile
        if (player.canAfford(HELLAS_BONUS_OCEAN_COST)) return super.getAvailableSpacesForCity(player);

        return super.getAvailableSpacesForCity(player).filter((space) => space.id !== SpaceName.HELLAS_OCEAN_TILE);
    }

    public getAvailableSpacesOnLand(player: Player): Array<ISpace> {
        // Check for special tile
        if (player.canAfford(HELLAS_BONUS_OCEAN_COST)) return super.getAvailableSpacesOnLand(player);

        return super.getAvailableSpacesOnLand(player).filter((space) => space.id !== SpaceName.HELLAS_OCEAN_TILE);
    }

    public getAvailableSpacesForGreenery(player: Player): Array<ISpace> {
        // Check for special tile
        if (player.canAfford(HELLAS_BONUS_OCEAN_COST)) return super.getAvailableSpacesForGreenery(player);

        return super.getAvailableSpacesForGreenery(player).filter((space) => space.id !== SpaceName.HELLAS_OCEAN_TILE);
    }

}
