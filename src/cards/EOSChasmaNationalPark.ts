import {ICard} from './ICard';

import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {SelectCard} from '../inputs/SelectCard';
import { Resources } from '../Resources';
import { CardName } from '../CardName';
import { ResourceType } from '../ResourceType';


export class EosChasmaNationalPark implements IProjectCard {
  public cost: number = 16;
  public nonNegativeVPIcon: boolean = true;
  public tags: Array<Tags> = [Tags.PLANT, Tags.STEEL];
  public name: CardName = CardName.EOS_CHASMA_NATIONAL_PARK;
  public cardType: CardType = CardType.AUTOMATED;

  public canPlay(player: Player, game: Game): boolean {
    return game.getTemperature() >= -12 - (
      2 * player.getRequirementsBonus(game)
    );
  }

  public play(player: Player) {
    const cards = player.getResourceCards(ResourceType.ANIMAL);
    player.plants += 3;
    player.setProduction(Resources.MEGACREDITS,2);

    if ( cards.length < 1 ) return undefined;
   
    return new SelectCard("Add 1 animal to a card",  cards, (foundCards: Array<ICard>) => {
        player.addResourceTo(foundCards[0], 1);
        return undefined;
    });
       
  }

  public getVictoryPoints() {
    return 1;
  }

}