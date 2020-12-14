import {IProjectCard} from '../IProjectCard';
import {ISpace} from '../../ISpace';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Board} from '../../Board';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class RoverConstruction implements IProjectCard {
    public cost = 8;
    public tags = [Tags.STEEL];
    public name = CardName.ROVER_CONSTRUCTION;
    public cardType = CardType.ACTIVE;

    public onTilePlaced(player: Player, space: ISpace) {
      if (Board.isCitySpace(space)) {
        player.megaCredits += 2;
      }
    }
    public play() {
      return undefined;
    }
    public getVictoryPoints() {
      return 1;
    }
    public metadata: CardMetadata = {
      cardNumber: '038',
      renderData: CardRenderer.builder((b) => {
        b.effectBox((eb) => {
          eb.city(CardRenderItemSize.SMALL).any.startEffect.megacredits(2);
          eb.description('Effect: When any City tile is placed, gain 2 MC.');
        });
      }),
      victoryPoints: 1,
    }
}
