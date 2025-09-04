const formatTimeBetweenPoints = (
  firstPointTime: Date | undefined,
  currentPointTime: Date | undefined,
  index: number
) => {
  let secondsSinceStart = 0;
  if (index === 0) {
    secondsSinceStart = 0;
  } else {
    const resultInMs = currentPointTime!.getTime() - firstPointTime!.getTime();
    secondsSinceStart = resultInMs / 1000;
  }

  return secondsSinceStart;
};

export default formatTimeBetweenPoints;
