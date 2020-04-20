import { IGlobalEvent } from './IGlobalEvent';
import { GlobalEventName } from './GlobalEventName';
import { PartyName } from '../parties/PartyName';
import { Game } from '../../Game';
import { Resources } from '../../Resources';
import { Turmoil } from '../Turmoil';

export class JovianTaxRights implements IGlobalEvent {
    public name = GlobalEventName.JOVIAN_TAX_RIGHTS;
    public description = "Increase M$ production 1 step for each colony. Gain 1 titanium for each influence.";
    public revealedDelegate = PartyName.SCIENTISTS;
    public currentDelegate = PartyName.UNITY;
    public resolve(game: Game, turmoil: Turmoil) {
        game.getPlayers().forEach(player => {
            let coloniesCount: number = 0;
            game.colonies.forEach(colony => { 
                coloniesCount += colony.colonies.filter(owner => owner === player).length;
            });  
            player.setProduction(Resources.MEGACREDITS, coloniesCount, undefined, undefined);
            player.setResource(Resources.TITANIUM, turmoil.getPlayerInfluence(player), undefined, undefined, true);
        });    
    }
}    