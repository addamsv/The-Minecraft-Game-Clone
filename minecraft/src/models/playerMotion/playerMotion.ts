/* eslint-disable no-param-reassign */

class PlayerMotion {
  public static smoothPlayerMotion(evDetail: any, mesh: any) {
    const zInitialVal = mesh.position.z;
    const zPosTo = Number(evDetail.z);
    const increaseZ = zInitialVal < zPosTo ? 1 : -1;

    const xInitialVal = mesh.position.x;
    const xPosTo = Number(evDetail.x);
    const increaseX = xInitialVal < xPosTo ? 1 : -1;

    const yInitialVal = mesh.position.y;
    const yPosTo = Number(evDetail.y);
    const increaseY = yInitialVal < yPosTo ? 1 : -1;

    const cInitialVal = mesh.rotation.y;
    const cPosTo = evDetail.c * Math.PI;
    const increaseC = cInitialVal < cPosTo ? 0.05 : -0.05;

    let isXReturnFlagHoisted = false;
    let isZReturnFlagHoisted = false;
    let isYReturnFlagHoisted = false;
    let isCReturnFlagHoisted = false;

    if ((cInitialVal > 0 && cPosTo < 0) || (cInitialVal < 0 && cPosTo > 0)) {
      mesh.rotation.y = cPosTo;
      isCReturnFlagHoisted = true;
    }

    function renderPlayerMotion() {
      /* return */
      if (
        isYReturnFlagHoisted
        && isXReturnFlagHoisted
        && isZReturnFlagHoisted
        && isCReturnFlagHoisted
      ) {
        return;
      }

      /* Z */
      if (!isZReturnFlagHoisted) {
        if ((increaseZ === -1 && zPosTo >= mesh.position.z)
        || (increaseZ === 1 && zPosTo <= mesh.position.z)) {
          mesh.position.z = zPosTo;
          isZReturnFlagHoisted = true;
        } else {
          mesh.position.z += increaseZ;
        }
      }

      /* X */
      if (!isXReturnFlagHoisted) {
        if ((increaseX === -1 && xPosTo >= mesh.position.x)
        || (increaseX === 1 && xPosTo <= mesh.position.x)) {
          mesh.position.x = xPosTo;
          isXReturnFlagHoisted = true;
        } else {
          mesh.position.x += increaseX;
        }
      }

      /* Y */
      if (!isYReturnFlagHoisted) {
        if ((increaseY === -1 && yPosTo >= mesh.position.y)
        || (increaseY === 1 && yPosTo <= mesh.position.y)) {
          mesh.position.y = yPosTo;
          isYReturnFlagHoisted = true;
        } else {
          mesh.position.y += increaseY;
        }
      }

      /* Cam rotation */
      if (!isCReturnFlagHoisted) {
        if ((increaseC === -0.05 && cPosTo >= mesh.rotation.y)
        || (increaseC === 0.05 && cPosTo <= mesh.rotation.y)) {
          mesh.rotation.y = cPosTo;
          isCReturnFlagHoisted = true;
        } else {
          mesh.rotation.y += increaseC;
        }
      }
      requestAnimationFrame(renderPlayerMotion);
    }
    renderPlayerMotion();
  }
}

export default PlayerMotion;
