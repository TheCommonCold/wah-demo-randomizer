export const consts = {
  localStorageKey: "wah-seen-demos",
};

export const randomWithProbabilities = (weights: number[]) => {
  const sum = weights.reduce((acc, weight) => {
    acc += weight;
    return acc;
  }, 0);

  const num = Math.random();
  const lastIndex = weights.length - 1;
  let s = 0;
  for (let i = 0; i < lastIndex; ++i) {
    s += weights[i] / sum;
    if (num < s) {
      return i;
    }
  }

  return lastIndex;
};
