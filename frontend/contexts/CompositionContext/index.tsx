import { createContext, useReducer, useContext } from "react";
import { getToneInstrument } from "../../components/DigitalAudioWorkstation/instruments";
import * as Tone from "tone";

const CompositionContext = createContext<Composition | null>(null);

const CompositionDispatchContext = createContext<React.Dispatch<any>>(
  () => null
);

interface CompositionProviderProps {
  children: React.ReactNode;
}

interface Composition {
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
  instruments: [],
};
