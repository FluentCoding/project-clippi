import produce from "immer";

import { createModel } from "@rematch/core";

import { EventConfig } from "@vinceau/slp-realtime";
import { Action as ActionDefinition } from "@vinceau/event-actions";

export interface NamedEventConfig extends EventConfig {
  name: string;
}

export interface AutomatorState {
  events: NamedEventConfig[];
  actions: {
    [eventId: string]: ActionDefinition[];
  };
}

const initialState: AutomatorState = {
  events: [],
  actions: {},
};

export const automator = createModel({
  state: initialState,
  reducers: {
    addEvent: (state: AutomatorState, payload: NamedEventConfig): AutomatorState =>
      produce(state, (draft) => {
        draft.events = draft.events.filter((e) => e.id !== payload.id);
        draft.events.push(payload);
      }),
    updateEvent: (
      state: AutomatorState,
      payload: { index: number; event: Omit<NamedEventConfig, "id"> }
    ): AutomatorState =>
      produce(state, (draft) => {
        const id = draft.events[payload.index].id;
        draft.events[payload.index] = { ...payload.event, id };
      }),
    removeEvent: (state: AutomatorState, payload: number): AutomatorState =>
      produce(state, (draft) => {
        const eventId = draft.events[payload].id;
        draft.events.splice(payload, 1);
        // Remove all the associated actions
        delete draft.actions[eventId];
      }),
    addNewEventAction: (
      state: AutomatorState,
      payload: { eventId: string; action: ActionDefinition }
    ): AutomatorState => {
      const { eventId, action } = payload;
      const newActions = produce(state.actions, (draft) => {
        if (!draft[eventId]) {
          draft[eventId] = [];
        }
        draft[eventId].push(action);
      });
      return produce(state, (draft) => {
        draft.actions = newActions;
      });
    },
    updateActionEvent: (
      state: AutomatorState,
      payload: { eventId: string; index: number; action: ActionDefinition }
    ): AutomatorState => {
      const { eventId, index, action } = payload;
      const newActions = produce(state.actions, (draft) => {
        draft[eventId][index] = action;
      });
      return produce(state, (draft) => {
        draft.actions = newActions;
      });
    },
    removeActionEvent: (state: AutomatorState, payload: { eventId: string; index: number }): AutomatorState => {
      const { eventId, index } = payload;
      const newActions = produce(state.actions, (draft) => {
        draft[eventId].splice(index, 1);
      });
      return produce(state, (draft) => {
        draft.actions = newActions;
      });
    },
  },
});