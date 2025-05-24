export const normalizePort = (portNum: string | undefined) => {
  if (!portNum) {
    return undefined;
  }

  const normPort = parseInt(portNum, 10);

  if (Number.isNaN(normPort) || normPort <= 0) {
    return undefined;
  }

  return normPort;
}