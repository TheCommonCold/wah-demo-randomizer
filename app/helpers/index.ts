export const isItTimeForAFreeDemoYet = ({
  freeDemosLength,
  premiumDemosLength,
  premiumInARowCount,
  premiumToFreeRatio,
}: {
  freeDemosLength: number;
  premiumDemosLength: number;
  premiumInARowCount: number;
  premiumToFreeRatio: number;
}) =>
  freeDemosLength == 0
    ? false
    : premiumDemosLength == 0
      ? true
      : premiumInARowCount >= Number(premiumToFreeRatio);
