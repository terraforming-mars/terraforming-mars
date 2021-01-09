import {CorporationCard} from '../corporation/CorporationCard';
import {Player} from '../../Player';
import {Tags} from '../Tags';
import {Game} from '../../Game';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {TileType} from '../../TileType';
import {SelectAmount} from '../../inputs/SelectAmount';
import {AndOptions} from '../../inputs/AndOptions';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {DeferredAction} from '../../deferredActions/DeferredAction';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';
import {AltSecondaryTag} from '../render/CardRenderItem';

export class Philares implements CorporationCard {
    public name = CardName.PHILARES;
    public tags = [Tags.BUILDING];
    public startingMegaCredits: number = 47;
    public cardType = CardType.CORPORATION;

    public initialActionText: string = 'Place a greenery tile and raise the oxygen 1 step';
    public initialAction(player: Player, game: Game) {
      return new SelectSpace('Select space for greenery tile',
        game.board.getAvailableSpacesForGreenery(player), (space: ISpace) => {
          game.addGreenery(player, space.id);

          game.log('${0} placed a Greenery tile', (b) => b.player(player));

          return undefined;
        });
    }

    private selectResources(player: Player, game: Game, resourceCount: number) {
      let megacreditsAmount: number = 0;
      let steelAmount: number = 0;
      let titaniumAmount: number = 0;
      let plantsAmount: number = 0;
      let energyAmount: number = 0;
      let heatAmount: number = 0;
      const selectMegacredit = new SelectAmount('Megacredits', 'Select', (amount: number) => {
        megacreditsAmount = amount;
        return undefined;
      }, 0, resourceCount);
      const selectSteel = new SelectAmount('Steel', 'Select', (amount: number) => {
        steelAmount = amount;
        return undefined;
      }, 0, resourceCount);
      const selectTitanium = new SelectAmount('Titanium', 'Select', (amount: number) => {
        titaniumAmount = amount;
        return undefined;
      }, 0, resourceCount);
      const selectPlants = new SelectAmount('Plants', 'Select', (amount: number) => {
        plantsAmount = amount;
        return undefined;
      }, 0, resourceCount);
      const selectEnergy = new SelectAmount('Energy', 'Select', (amount: number) => {
        energyAmount = amount;
        return undefined;
      }, 0, resourceCount);
      const selectHeat = new SelectAmount('Heat', 'Select', (amount: number) => {
        heatAmount = amount;
        return undefined;
      }, 0, resourceCount);
      const selectResources = new AndOptions(
        () => {
          if (
            megacreditsAmount +
                    steelAmount +
                    titaniumAmount +
                    plantsAmount +
                    energyAmount +
                    heatAmount > resourceCount
          ) {
            throw new Error('Need to select ' + resourceCount + ' resource(s)');
          }
          player.megaCredits += megacreditsAmount;
          player.steel += steelAmount;
          player.titanium += titaniumAmount;
          player.plants += plantsAmount;
          player.energy += energyAmount;
          player.heat += heatAmount;
          return undefined;
        }, selectMegacredit, selectSteel, selectTitanium, selectPlants, selectEnergy, selectHeat);
      selectResources.title = 'Philares effect: select ' + resourceCount + ' resource(s)';
      game.defer(new DeferredAction(
        player,
        () => selectResources,
      ));
    }

    public onTilePlaced(player: Player, space: ISpace, game: Game): void {
      const philaresPlayer = game.getPlayers().find((player) => player.isCorporation(CardName.PHILARES));
      if (philaresPlayer === undefined) {
        console.error('Could not find Philares player');
        return;
      }
      if (space.tile !== undefined && space.tile.tileType !== TileType.OCEAN) {
        let bonusResource: number = 0;
        if (space.player !== undefined && space.player.id === philaresPlayer.id) {
          bonusResource = game.board.getAdjacentSpaces(space)
            .filter((space) => space.tile !== undefined && space.player !== undefined && space.player !== player)
            .length;
        } else if (space.player !== undefined && space.player.id !== philaresPlayer.id) {
          bonusResource = game.board.getAdjacentSpaces(space)
            .filter((space) => space.tile !== undefined && space.player !== undefined && space.player.id === philaresPlayer.id)
            .length;
        }
        if (bonusResource > 0) {
          this.selectResources(philaresPlayer, game, bonusResource);
        }
      }
    }

    public play() {
      return undefined;
    }

    public metadata: CardMetadata = {
      cardNumber: 'R25',
      description: 'You start with 47 MC. As your first action, place a greenery tile and raise the oxygen 1 step.',
      renderData: CardRenderer.builder((b) => {
        b.megacredits(47).greenery().secondaryTag(AltSecondaryTag.OXYGEN);
        b.corpBox('effect', (ce) => {
          ce.effect('Each new adjacency between your tile and an opponent\'s tile gives you a standard resource of your choice [regardless of who just placed a tile].', (eb) => {
            eb.emptyTile('normal', CardRenderItemSize.SMALL).any.nbsp;
            eb.emptyTile('normal', CardRenderItemSize.SMALL).startEffect.wild(1);
          });
        });
      }),
    }
}
