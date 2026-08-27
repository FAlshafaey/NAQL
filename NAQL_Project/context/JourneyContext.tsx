"use client";

import { createContext, useCallback, useContext, useMemo, useReducer, type ReactNode } from "react";
import { generateDefaultExpenses, DEFAULT_BUDGET_TOTAL } from "@/data/expenses";
import { generateDefaultPackingRooms } from "@/data/packing";
import { generateDefaultTasks } from "@/data/tasks";
import { generateId, todayISO } from "@/lib/utils";
import type { Expense, ExpenseCategory, JourneyInfo, Task, TaskCategory, TaskPriority } from "@/types";

interface JourneyState {
  journey: JourneyInfo | null;
  tasks: Task[];
  packingRooms: ReturnType<typeof generateDefaultPackingRooms>;
  budgetTotal: number;
  expenses: Expense[];
}

const initialState: JourneyState = {
  journey: null,
  tasks: [],
  packingRooms: [],
  budgetTotal: 0,
  expenses: [],
};

type Action =
  | { type: "START_JOURNEY"; journey: JourneyInfo }
  | { type: "RESET_JOURNEY" }
  | { type: "ADD_TASK"; task: Task }
  | { type: "UPDATE_TASK"; id: string; updates: Partial<Omit<Task, "id">> }
  | { type: "DELETE_TASK"; id: string }
  | { type: "TOGGLE_TASK"; id: string }
  | { type: "TOGGLE_PACKING_ITEM"; roomId: string; itemId: string }
  | { type: "SET_BUDGET_TOTAL"; total: number }
  | { type: "ADD_EXPENSE"; expense: Expense }
  | { type: "DELETE_EXPENSE"; id: string };

function reducer(state: JourneyState, action: Action): JourneyState {
  switch (action.type) {
    case "START_JOURNEY":
      return {
        journey: action.journey,
        tasks: generateDefaultTasks(action.journey.movingDate),
        packingRooms: generateDefaultPackingRooms(),
        budgetTotal: DEFAULT_BUDGET_TOTAL,
        expenses: generateDefaultExpenses(),
      };
    case "RESET_JOURNEY":
      return initialState;
    case "ADD_TASK":
      return { ...state, tasks: [action.task, ...state.tasks] };
    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) => (task.id === action.id ? { ...task, ...action.updates } : task)),
      };
    case "DELETE_TASK":
      return { ...state, tasks: state.tasks.filter((task) => task.id !== action.id) };
    case "TOGGLE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.id ? { ...task, completed: !task.completed } : task
        ),
      };
    case "TOGGLE_PACKING_ITEM":
      return {
        ...state,
        packingRooms: state.packingRooms.map((room) =>
          room.id === action.roomId
            ? {
                ...room,
                items: room.items.map((item) =>
                  item.id === action.itemId ? { ...item, completed: !item.completed } : item
                ),
              }
            : room
        ),
      };
    case "SET_BUDGET_TOTAL":
      return { ...state, budgetTotal: Math.max(0, action.total) };
    case "ADD_EXPENSE":
      return { ...state, expenses: [action.expense, ...state.expenses] };
    case "DELETE_EXPENSE":
      return { ...state, expenses: state.expenses.filter((expense) => expense.id !== action.id) };
    default:
      return state;
  }
}

interface JourneyContextValue extends JourneyState {
  hasStarted: boolean;
  startJourney: (journey: Omit<JourneyInfo, "startedAt">) => void;
  resetJourney: () => void;
  addTask: (input: { title: string; category: TaskCategory; priority: TaskPriority; dueDate: string }) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, "id">>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  togglePackingItem: (roomId: string, itemId: string) => void;
  setBudgetTotal: (total: number) => void;
  addExpense: (input: { label: string; category: ExpenseCategory; amount: number }) => void;
  deleteExpense: (id: string) => void;
}

const JourneyContext = createContext<JourneyContextValue | null>(null);

export function JourneyProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const startJourney = useCallback((journey: Omit<JourneyInfo, "startedAt">) => {
    dispatch({ type: "START_JOURNEY", journey: { ...journey, startedAt: new Date().toISOString() } });
  }, []);

  const resetJourney = useCallback(() => dispatch({ type: "RESET_JOURNEY" }), []);

  const addTask = useCallback(
    (input: { title: string; category: TaskCategory; priority: TaskPriority; dueDate: string }) => {
      dispatch({
        type: "ADD_TASK",
        task: { id: generateId("task"), completed: false, ...input },
      });
    },
    []
  );

  const updateTask = useCallback((id: string, updates: Partial<Omit<Task, "id">>) => {
    dispatch({ type: "UPDATE_TASK", id, updates });
  }, []);

  const deleteTask = useCallback((id: string) => dispatch({ type: "DELETE_TASK", id }), []);

  const toggleTask = useCallback((id: string) => dispatch({ type: "TOGGLE_TASK", id }), []);

  const togglePackingItem = useCallback((roomId: string, itemId: string) => {
    dispatch({ type: "TOGGLE_PACKING_ITEM", roomId, itemId });
  }, []);

  const setBudgetTotal = useCallback((total: number) => dispatch({ type: "SET_BUDGET_TOTAL", total }), []);

  const addExpense = useCallback((input: { label: string; category: ExpenseCategory; amount: number }) => {
    dispatch({
      type: "ADD_EXPENSE",
      expense: { id: generateId("expense"), date: todayISO(), ...input },
    });
  }, []);

  const deleteExpense = useCallback((id: string) => dispatch({ type: "DELETE_EXPENSE", id }), []);

  const value = useMemo<JourneyContextValue>(
    () => ({
      ...state,
      hasStarted: state.journey !== null,
      startJourney,
      resetJourney,
      addTask,
      updateTask,
      deleteTask,
      toggleTask,
      togglePackingItem,
      setBudgetTotal,
      addExpense,
      deleteExpense,
    }),
    [state, startJourney, resetJourney, addTask, updateTask, deleteTask, toggleTask, togglePackingItem, setBudgetTotal, addExpense, deleteExpense]
  );

  return <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>;
}

export function useJourney(): JourneyContextValue {
  const ctx = useContext(JourneyContext);
  if (!ctx) {
    throw new Error("useJourney يجب أن يُستخدم داخل JourneyProvider");
  }
  return ctx;
}
