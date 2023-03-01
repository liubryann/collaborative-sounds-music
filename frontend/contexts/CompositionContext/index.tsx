import { createContext, useReducer, useContext } from "react";

const CompositionContext = createContext<Composition | null>(null);

const CompositionDispatchContext = createContext<React.Dispatch<any>>(
  () => null
);

interface CompositionProviderProps {
  children: React.ReactNode;
}

interface Composition {
  counter: number;
  instruments: string[];
}

interface CompositionAction {
  type: string;
  payload: any;
}

export function CompositionProvider({ children }: CompositionProviderProps) {
  const [composition, dispatch] = useReducer(
    compositionReducer,
    initialComposition
  );

  return (
    <CompositionContext.Provider value={composition}>
      <CompositionDispatchContext.Provider value={dispatch}>
        {children}
      </CompositionDispatchContext.Provider>
    </CompositionContext.Provider>
  );
}

export function useComposition() {
  return useContext(CompositionContext);
}

export function useCompositionDispatch() {
  return useContext(CompositionDispatchContext);
}

function compositionReducer(
  composition: Composition,
  action: CompositionAction
) {
  switch (action.type) {
    case "increment": {
      return {
        ...composition,
        counter: composition.counter + 1,
      };
    }
    case "addInstrument": {
      return {
        ...composition,
        instruments: [...composition.instruments, action.payload.instrument],
      };
    }
    default: {
      return composition;
    }
  }
}

const initialComposition: Composition = {
  counter: 0,
  instruments: [],
};
