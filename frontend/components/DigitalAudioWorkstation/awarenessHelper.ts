const colors = [
  "#FFB3B3",
  "#FFCCB3",
  "#FFE5B3",
  "#FFFFB3",
  "#B3FFB3",
  "#B3FFCC",
  "#B3FFE5",
  "#B3FFFF",
  "#B3CCFF",
  "#B3B3FF",
  "#CCB3FF",
  "#E5B3FF",
  "#FFB3FF",
  "#FFB3CC",
  "#FFB3E5",
  "#FFD1D1",
  "#FFDDB3",
  "#FFF2B3",
  "#FFFFD1",
  "#D1FFD1",
  "#B3FFD1",
  "#D1FFFF",
  "#D1B3FF",
  "#FFB3D1",
  "#FFD1FF",
  "#F2B3FF",
  "#FFCCE5",
  "#FFE5CC",
  "#FFF2D1",
  "#FFE5D1",
  "#D1FFE5",
  "#CCFFE5",
  "#D1FFF2",
  "#D1CCFF",
  "#E5B3D1",
  "#FFB3F2",
  "#E5CCE5",
  "#F2E5B3",
  "#FFFFCC",
  "#F2FFE5",
  "#D1FFF2",
  "#B3E5D1",
  "#B3F2FF",
  "#CCD1FF",
  "#E5F2B3",
  "#FFE5F2",
  "#F8B3B3",
  "#FFA3A3",
  "#FF8F8F",
  "#FF7F7F",
  "#FF6B6B",
  "#FF5B5B",
  "#FF4747",
  "#FF3737",
  "#FF2323",
  "#FF1313",
  "#FF0303",
  "#E50000",
  "#B30000",
  "#FFB3A3",
  "#FFA3B3",
  "#FFC1B3",
  "#FFD9B3",
  "#FFEEB3",
  "#F2FFB3",
  "#D1FFB3",
  "#B3FFC1",
  "#B3FFD9",
  "#B3FFEE",
  "#B3F2FF",
  "#B3D1FF",
  "#B3B3FF",
  "#D9B3FF",
  "#EEB3FF",
  "#FFB3EE",
  "#FFB3D9",
  "#FFB3C1",
  "#FFD1B3",
  "#FFE5B3",
  "#FFC1D9",
  "#FFB3F2",
  "#FFD9EE",
  "#FFEEF2",
  "#F2D1FF",
  "#F2E5FF",
  "#FFCCE5",
  "#FFCCF2",
  "#F2FFE5",
  "#FFF2E5",
  "#FFE5CC",
  "#FFE5F2",
  "#FFF2FF",
  "#CCE5FF",
  "#E5CCE5",
  "#CCF2FF",
  "#F2E5D1",
  "#FFE5D9",
  "#FFF2D9",
  "#FFE5EE",
  "#FFF2EE",
  "#E5FFE5",
  "#D9FFE5",
  "#EEFFE5",
  "#E5F2FF",
  "#D9F2FF",
];

export interface UserAwareness {
  username: string;
  color: string;
  selectedPart?: string;
}

export type SelectedPartAwareness = { [partId: string]: string[] };
export type SelectedCellAwareness = {
  [partId: string]: { [cellId: string]: string };
};

export const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

export const setUserPresence = (
  awareness: any,
  username: string | undefined
): void => {
  if (!username) {
    return;
  }
  const color = getRandomColor();
  awareness.setLocalStateField("user", {
    username: username,
    color: color,
  });
};

export const parseAwarenessStates = (
  awareness: any
): [UserAwareness[], SelectedPartAwareness, any] => {
  const states = awareness.getStates();
  const usersAwareness: UserAwareness[] = [];
  const selectedPartAwareness: SelectedPartAwareness = {};
  const selectedCellAwareness: SelectedCellAwareness = {};

  states.forEach((state: any) => {
    if (!state?.user) {
      return;
    }
    usersAwareness.push({
      username: state.user.username,
      color: state.user.color,
      selectedPart: state.user.selectedPart,
    });
    if (state.user.selectedPart) {
      if (!selectedPartAwareness[state.user.selectedPart]) {
        selectedPartAwareness[state.user.selectedPart] = [];
      }
      selectedPartAwareness[state.user.selectedPart].push(state.user.color);
    }
    if (state.user.selectedCell) {
      if (!selectedCellAwareness[state.user.selectedPart]) {
        selectedCellAwareness[state.user.selectedPart] = {};
      }
      selectedCellAwareness[state.user.selectedPart][state.user.selectedCell] =
        state.user.color;
    }
  });
  return [usersAwareness, selectedPartAwareness, selectedCellAwareness];
};

export const removeUserPresence = (awareness: any): void => {
  if (!awareness) {
    return;
  }
  awareness.setLocalState(null);
};

export const setUserSelectedPartAwareness = (
  awareness: any,
  part: string
): void => {
  const localState = awareness.getLocalState();
  if (!localState?.user) {
    return;
  }
  delete localState.user.selectedCell;
  awareness.setLocalStateField("user", {
    ...localState.user,
    selectedPart: part,
  });
};

export const setUserSelectedCellAwareness = (
  awareness: any,
  partId: string,
  i: number,
  j: number
) => {
  const localState = awareness.getLocalState();
  awareness.setLocalStateField("user", {
    ...localState.user,
    selectedPart: partId,
    selectedCell: [i, j],
  });
};

const awarennessHelper = {
  getRandomColor,
  setUserPresence,
  parseAwarenessStates,
  removeUserPresence,
  setUserSelectedPartAwareness,
};

export default awarennessHelper;
