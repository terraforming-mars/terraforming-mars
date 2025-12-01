import SelectProjectCardToPlay from "@/client/components/SelectProjectCardToPlay.vue";
import TimeWarp from "@/client/components/TimeWarp.vue";
import WaitingFor from "@/client/components/WaitingFor.vue";
import { CardName } from "@/common/cards/CardName";
import { CardModel } from "@/common/models/CardModel";
import {
  OrOptionsModel,
  SelectProjectCardToPlayModel,
} from "@/common/models/PlayerInputModel";
import {
  PlayerViewModel,
  PublicPlayerModel,
} from "@/common/models/PlayerModel";
import { Phase } from "@/common/Phase";
import { Units } from "@/common/Units";
import { RecursivePartial } from "@/common/utils/utils";
import * as rawSettings from "@/genfiles/settings.json";
import { mount } from "@vue/test-utils";
import { expect } from "chai";
import { FakeLocalStorage } from "./FakeLocalStorage";
import { getLocalVue } from "./getLocalVue";

const SELECTION_INDEX = 1;

function createPublicPlayer(
  overrides: Partial<PublicPlayerModel>
): PublicPlayerModel {
  return Object.assign(
    {
      actionsTakenThisRound: 0,
      actionsThisGeneration: [],
      actionsTakenThisGame: 0,
      availableBlueCardActionCount: 0,
      cardCost: 0,
      cardDiscount: 0,
      cardsInHandNbr: 0,
      citiesCount: 0,
      coloniesCount: 0,
      color: "red",
      energy: 0,
      energyProduction: 0,
      fleetSize: 0,
      heat: 0,
      heatProduction: 0,
      id: "player-1",
      influence: 0,
      isActive: false,
      megaCredits: 0,
      megaCreditProduction: 0,
      name: "Player",
      noTagsCount: 0,
      plants: 0,
      plantProduction: 0,
      protectedResources: {} as any,
      protectedProduction: {} as any,
      tableau: [],
      selfReplicatingRobotsCards: [],
      steel: 0,
      steelProduction: 0,
      steelValue: 2,
      tags: {} as any,
      terraformRating: 20,
      timer: {} as any,
      titanium: 0,
      titaniumProduction: 0,
      titaniumValue: 3,
      tradesThisGeneration: 0,
      underworldData: {} as any,
      victoryPointsBreakdown: {} as any,
      victoryPointsByGeneration: [],
      needsToDraft: false,
      needsToResearch: false,
      handicap: undefined,
      lastCardPlayed: undefined,
    },
    overrides
  ) as PublicPlayerModel;
}

function createPlayerView(players: PublicPlayerModel[]): PlayerViewModel {
  const playerView: RecursivePartial<PlayerViewModel> = {
    id: players[0].id ?? "player-1",
    runId: "run-1",
    autopass: false,
    cardsInHand: [],
    dealtCorporationCards: [],
    dealtPreludeCards: [],
    dealtProjectCards: [],
    dealtCeoCards: [],
    draftedCards: [],
    ceoCardsInHand: [],
    pickedCorporationCard: [],
    preludeCardsInHand: [],
    thisPlayer: players[0],
    players,
    game: {
      phase: Phase.ACTION,
      expectedPurgeTimeMs: 0,
      gameAge: 1,
      undoCount: 0,
      colonies: [],
    } as any,
    waitingFor: undefined,
  };
  return playerView as PlayerViewModel;
}

function createProjectCardOptions(): {
  orOptions: OrOptionsModel;
  cardName: CardName;
} {
  const cards: Array<CardModel> = [
    {
      name: CardName.AI_CENTRAL,
      calculatedCost: 10,
      reserveUnits: Units.EMPTY,
    } as CardModel,
    {
      name: CardName.ASTEROID_MINING,
      calculatedCost: 14,
      reserveUnits: Units.EMPTY,
    } as CardModel,
  ];

  const selectProject: SelectProjectCardToPlayModel = {
    type: "projectCard",
    title: "Play project card",
    buttonLabel: "Play card",
    cards,
    paymentOptions: {},
    microbes: 0,
    floaters: 0,
    lunaArchivesScience: 0,
    seeds: 0,
    graphene: 0,
    kuiperAsteroids: 0,
  };

  return {
    orOptions: {
      type: "or",
      title: "Take action",
      buttonLabel: "Take action",
      options: [selectProject],
    },
    cardName: cards[SELECTION_INDEX].name,
  };
}

function createRootMock(playerView: PlayerViewModel) {
  return {
    playerView,
    playerkey: 0,
    screen: "player-home",
    settings: rawSettings,
    isServerSideRequestInProgress: false,
    componentsVisibility: {},
    showAlert: () => {},
    updatePlayer: () => {},
    updateSpectator: () => {},
  };
}

describe("TimeWarp", () => {
  let localStorage: FakeLocalStorage;

  beforeEach(() => {
    localStorage = new FakeLocalStorage();
    FakeLocalStorage.register(localStorage);
  });

  afterEach(() => {
    FakeLocalStorage.deregister(localStorage);
  });

  it("keeps selected card highlighted through a playerkey redraw", async () => {
    const localVue = getLocalVue();
    const playerOne = createPublicPlayer({
      id: "player-1",
      color: "red" as any,
      name: "Player 1",
      megaCredits: 20,
    });
    const playerTwo = createPublicPlayer({
      id: "player-2",
      color: "blue" as any,
      name: "Player 2",
    });
    const playerView = createPlayerView([playerOne, playerTwo]);
    const { orOptions, cardName } = createProjectCardOptions();

    const wrapper = mount(TimeWarp, {
      localVue,
      propsData: {
        playerView,
        players: playerView.players,
        settings: rawSettings,
        waitingfor: undefined,
      },
      mocks: {
        $root: createRootMock(playerView),
      },
    });

    await wrapper.setData({
      cachedWaitingFor: JSON.parse(JSON.stringify(orOptions)),
    });
    await wrapper.vm.$nextTick();

    (wrapper.vm as any).activate();
    await wrapper.vm.$nextTick();

    const waitingFors = wrapper.findAllComponents(WaitingFor);
    expect(waitingFors.length).to.be.greaterThan(1);
    const timeWarpWaitingFor = waitingFors.at(1);
    const projectComponent = timeWarpWaitingFor.findComponent(
      SelectProjectCardToPlay
    );
    const radioInputs = projectComponent.findAll('input[type="radio"]');
    expect(radioInputs.length).to.be.greaterThan(1);
    await radioInputs.at(SELECTION_INDEX).setChecked();
    await projectComponent.vm.$nextTick();
    expect((projectComponent.vm as any).cardName).to.eq(cardName);

    wrapper.destroy();

    const remounted = mount(TimeWarp, {
      localVue,
      propsData: {
        playerView,
        players: playerView.players,
        settings: rawSettings,
        waitingfor: undefined,
      },
      mocks: {
        $root: createRootMock(playerView),
      },
    });

    await remounted.vm.$nextTick();

    const remountedWaitingFors = remounted.findAllComponents(WaitingFor);
    expect(remountedWaitingFors.length).to.be.greaterThan(1);
    const remountedTimeWarpWaitingFor = remountedWaitingFors.at(1);
    const remountedProjectComponent = remountedTimeWarpWaitingFor.findComponent(
      SelectProjectCardToPlay
    );
    const remountedRadios = remountedProjectComponent.findAll(
      'input[type="radio"]'
    );
    expect(remountedRadios.length).to.be.greaterThan(1);
    expect(
      (remountedRadios.at(SELECTION_INDEX).element as HTMLInputElement).checked
    ).to.be.true;

    remounted.destroy();
  });

  it("restores waiting-for UI state when stored scroll data is missing", async () => {
    const localVue = getLocalVue();
    const playerOne = createPublicPlayer({
      id: "player-1",
      color: "red" as any,
      name: "Player 1",
    });
    const playerView = createPlayerView([playerOne]);

    localStorage.setItem(
      "timeWarpWaitingForState",
      JSON.stringify({ inputs: [] })
    );

    const wrapper = mount(TimeWarp, {
      localVue,
      propsData: {
        playerView,
        players: playerView.players,
        settings: rawSettings,
        waitingfor: undefined,
      },
      mocks: {
        $root: createRootMock(playerView),
      },
    });

    await wrapper.vm.$nextTick();

    (wrapper.vm as any).$refs.waitingForPanel = document.createElement("div");

    expect(() => {
      (wrapper.vm as any).restoreWaitingForState();
    }).to.not.throw();

    wrapper.destroy();
  });
});
