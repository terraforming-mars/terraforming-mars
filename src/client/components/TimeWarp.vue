<template>
  <div style="display: content">
    <waiting-for
      :players="players"
      :playerView="playerView"
      :settings="settings"
      :waitingfor="waitingfor"
    />
    <div v-if="showActivate">
      <button @click="activate">time warp</button>
    </div>
    <div
      v-if="showDeactivate"
      style="background-color: #444444"
      ref="waitingForPanel"
    >
      <button @click="deactivate">reality anchor</button>
      <waiting-for
        :players="players"
        :playerView="playerView"
        :settings="settings"
        :waitingfor="cachedWaitingFor"
        :timeWarpQueue="queue"
        @queue-updated="rememberWaitingForState"
      />
      <pre>{{ JSON.stringify(queue, null, 2) }}</pre>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import * as raw_settings from "@/genfiles/settings.json";
import { vueRoot } from "@/client/components/vueRoot";
import { paths } from "@/common/app/paths";
import { Phase } from "@/common/Phase";
import WaitingFor from "@/client/components/WaitingFor.vue";
import {
  PublicPlayerModel,
  PlayerViewModel,
} from "@/common/models/PlayerModel";
import {
  OrOptionsModel,
  PlayerInputModel,
} from "@/common/models/PlayerInputModel";

type StoredInputState = {
  path: number[];
  type: string;
  value?: string;
  checked?: boolean;
};

type WaitingForUiState = {
  inputs: StoredInputState[];
};

const WAITING_FOR_STATE_STORAGE_KEY = "timeWarpWaitingForState";

function isInputElement(element: Element): element is HTMLInputElement {
  return element.tagName === "INPUT";
}

function isTextAreaElement(element: Element): element is HTMLTextAreaElement {
  return element.tagName === "TEXTAREA";
}

function isSelectElement(element: Element): element is HTMLSelectElement {
  return element.tagName === "SELECT";
}

function createBubbledEvent(target: Element, eventName: string): Event | null {
  const doc = target.ownerDocument || (typeof document !== "undefined" ? document : undefined);
  const view = doc?.defaultView;
  const EventCtor = view?.Event ?? (typeof Event === "function" ? Event : undefined);
  if (EventCtor) {
    try {
      return new EventCtor(eventName, { bubbles: true });
    } catch (err) {
      console.warn("Unable to construct event via constructor", err);
    }
  }
  if (doc) {
    try {
      const legacyEvent = doc.createEvent("Event");
      legacyEvent.initEvent(eventName, true, false);
      return legacyEvent;
    } catch (err) {
      console.warn("Unable to construct legacy event", err);
    }
  }
  return null;
}

function dispatchBubbledEvent(target: Element, eventName: string): void {
  const event = createBubbledEvent(target, eventName);
  if (!event) return;
  target.dispatchEvent(event);
}

let DATA_STATE = {
  loadedCachedWaitingFor: false,
  cachedWaitingFor: undefined as OrOptionsModel | undefined,
  queue: undefined as any[] | undefined,
};

let LOADED_WAITING_FOR_UI_STATE = false;
let CACHED_WAITING_FOR_UI_STATE: WaitingForUiState | undefined;

function loadWaitingForUiState(): WaitingForUiState | undefined {
  if (!LOADED_WAITING_FOR_UI_STATE) {
    LOADED_WAITING_FOR_UI_STATE = true;
    try {
      const raw = localStorage.getItem(WAITING_FOR_STATE_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<WaitingForUiState>;
        CACHED_WAITING_FOR_UI_STATE = {
          inputs: Array.isArray(parsed.inputs) ? parsed.inputs : [],
        };
      }
    } catch (err) {
      console.warn("Unable to read waiting-for UI state", err);
    }
  }
  return CACHED_WAITING_FOR_UI_STATE;
}

function saveWaitingForUiState(state: WaitingForUiState | undefined): void {
  CACHED_WAITING_FOR_UI_STATE = state;
  if (!state) {
    try {
      localStorage.removeItem(WAITING_FOR_STATE_STORAGE_KEY);
    } catch (err) {
      console.warn("Unable to clear waiting-for UI state", err);
    }
    return;
  }
  try {
    localStorage.setItem(WAITING_FOR_STATE_STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn("Unable to persist waiting-for UI state", err);
  }
}

function getElementByPath(root: Element, path: number[]): Element | null {
  let current: Element | null = root;
  for (const index of path) {
    if (!current || !current.children || index >= current.children.length) {
      return null;
    }
    current = current.children[index];
  }
  return current;
}

function collectWaitingForUiState(root: Element): WaitingForUiState {
  const inputs: StoredInputState[] = [];

  const visit = (element: Element, path: number[]) => {
    if (isInputElement(element)) {
      const input = element as HTMLInputElement;
      const type = input.type;
      if (type === "checkbox" || type === "radio") {
        inputs.push({
          path: [...path],
          type,
          checked: input.checked,
        });
      } else {
        inputs.push({
          path: [...path],
          type,
          value: input.value,
        });
      }
    } else if (isTextAreaElement(element)) {
      const textarea = element as HTMLTextAreaElement;
      inputs.push({
        path: [...path],
        type: "textarea",
        value: textarea.value,
      });
    } else if (isSelectElement(element)) {
      const select = element as HTMLSelectElement;
      inputs.push({
        path: [...path],
        type: "select",
        value: select.value,
      });
    }

    Array.from(element.children).forEach((child, index) => {
      visit(child, [...path, index]);
    });
  };

  visit(root, []);
  return { inputs };
}

const MAX_WAITING_FOR_RESTORE_ATTEMPTS = 5;

function restoreWaitingForUiState(
  root: Element,
  state: WaitingForUiState,
  attempt = 0
): void {
  let needsRetry = false;

  state.inputs.forEach((storedState) => {
    const element = getElementByPath(root, storedState.path);
    const isConnected = Boolean((element as Element | null)?.isConnected);

    if (!element || !isConnected) {
      needsRetry = true;
      return;
    }

    if (isInputElement(element)) {
      const input = element as HTMLInputElement;
      if (storedState.type === "checkbox" || storedState.type === "radio") {
        const shouldCheck = Boolean(storedState.checked);
        if (input.checked !== shouldCheck) {
          input.checked = shouldCheck;
          dispatchBubbledEvent(input, "change");
          dispatchBubbledEvent(input, "input");
        }
      } else if (
        storedState.value !== undefined &&
        input.value !== storedState.value
      ) {
        input.value = storedState.value;
        dispatchBubbledEvent(input, "input");
        dispatchBubbledEvent(input, "change");
      }
    } else if (isTextAreaElement(element) || isSelectElement(element)) {
      const formElement = element as HTMLTextAreaElement | HTMLSelectElement;
      if (
        storedState.value !== undefined &&
        formElement.value !== storedState.value
      ) {
        formElement.value = storedState.value;
        dispatchBubbledEvent(formElement, "input");
        dispatchBubbledEvent(formElement, "change");
      }
    }
  });

  if (needsRetry) {
    if (attempt + 1 >= MAX_WAITING_FOR_RESTORE_ATTEMPTS) {
      return;
    }

    const scheduleRetry =
      typeof window !== "undefined"
        ? window.setTimeout.bind(window)
        : undefined;

    if (scheduleRetry) {
      scheduleRetry(() => restoreWaitingForUiState(root, state, attempt + 1), 16);
    }
  }
}

export default Vue.extend({
  name: "time-warp",
  components: { WaitingFor },

  props: {
    playerView: Object as PropType<PlayerViewModel>,
    players: Array as PropType<PublicPlayerModel[]>,
    settings: Object as PropType<typeof raw_settings>,
    waitingfor: Object as PropType<PlayerInputModel | undefined>,
  },

  data() {
    if (!DATA_STATE.loadedCachedWaitingFor) {
      DATA_STATE.cachedWaitingFor =
        JSON.parse(localStorage.getItem("cachedWaitingFor")!) || undefined;
      DATA_STATE.loadedCachedWaitingFor = true;
    }
    return DATA_STATE;
  },

  computed: {
    showActivate(): boolean {
      return this.showTrinary() === true;
    },
    showDeactivate(): boolean {
      return this.showTrinary() === false;
    },
    styleF(): Record<string, string> {
      return this.showDeactivate ? { backgroundColor: "#444444" } : {};
    },
  },
  mounted() {
    this.handleNewVal(this.waitingfor);
    if (this.showDeactivate) {
      this.$nextTick(() => this.restoreWaitingForState());
    }
  },
  beforeDestroy() {
    this.rememberWaitingForState();
  },
  watch: {
    showDeactivate(newVal: boolean) {
      if (newVal) {
        this.$nextTick(() => this.restoreWaitingForState());
      } else {
        this.rememberWaitingForState();
      }
    },
  },
  methods: {
    activate() {
      this.queue = [];
      this.$nextTick(() => this.restoreWaitingForState());
    },
    deactivate() {
      this.rememberWaitingForState();
      this.queue = undefined;
    },
    rememberWaitingForState() {
      const root = this.$refs.waitingForPanel as HTMLElement | undefined;
      if (!root) return;
      try {
        const state = collectWaitingForUiState(root);
        saveWaitingForUiState(state);
      } catch (err) {
        console.warn("Unable to remember waiting-for UI state", err);
      }
    },
    restoreWaitingForState() {
      const root = this.$refs.waitingForPanel as HTMLElement | undefined;
      if (!root) return;
      const state = loadWaitingForUiState();
      if (!state) return;
      try {
        restoreWaitingForUiState(root, state);
      } catch (err) {
        console.warn("Unable to restore waiting-for UI state", err);
      }
    },
    showTrinary(): boolean | null {
      // true = time warp, false = reality anchor, null = neither
      if (this.playerView?.game.phase !== Phase.ACTION) {
        return null;
      }
      if (this.queue) return false;
      return !this.waitingfor && this.cachedWaitingFor ? true : null;
    },
    handleNewVal(newVal: PlayerInputModel | undefined): void {
      if (
        newVal &&
        newVal.type === "or" &&
        newVal.buttonLabel === "Take action"
      ) {
        if (!this.queue) {
          const clone =
            typeof structuredClone === "function"
              ? structuredClone(newVal)
              : JSON.parse(JSON.stringify(newVal));
          this.cachedWaitingFor = clone;
          localStorage.setItem("cachedWaitingFor", JSON.stringify(clone));
        } else {
          const payload = this.queue.shift();
          if (!payload) {
            this.deactivate();
            return;
          }
          const selectedOptionTitle =
            this.cachedWaitingFor?.options[payload.index].title;
          const optionsTitles = newVal.options.map((o) => o.title);
          const index = optionsTitles.indexOf(selectedOptionTitle!);
          if (index === -1) {
            this.deactivate();
            return;
          }
          payload.index = index;
          const root = vueRoot(this);
          if (root.isServerSideRequestInProgress) {
            console.warn("Server request in progress");
            return;
          }
          root.isServerSideRequestInProgress = true;

          fetch(paths.PLAYER_INPUT + "?id=" + this.playerView.id, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          })
            .then((resp) => {
              if (!resp.ok) {
                throw new Error(`Error getting game data: ${resp.statusText}`);
              }
              return resp.json();
            })
            .then((playerView: PlayerViewModel | undefined) => {
              root.isServerSideRequestInProgress = false;
              if (!this.queue || this.queue.length === 0) this.deactivate();

              root.screen = "empty";
              root.playerView = playerView;
              root.playerkey++;
              root.screen = "player-home";
            })
            .catch(() => {
              root.isServerSideRequestInProgress = false;
              this.deactivate();
            });
        }
      }
    },
  },
});
</script>
