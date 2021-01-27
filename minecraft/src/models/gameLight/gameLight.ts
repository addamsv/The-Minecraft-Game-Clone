import * as THREE from 'three';
import GameLightInterface from './gameLightInterface';

const SIN_MYLTIPLY = 0.00001;
const SUNRISE_ANGLE = 0.3;
const TIMEOUT = 30000;
const MAX_SUN_X = 500;
const MAX_SUN_Y = 1000;
const MIN_SUN_Z = -1000;

class GameLight implements GameLightInterface {
  public isNight: boolean;

  public isLantern: boolean;

  private isMorning: boolean;

  private isEvening: boolean;

  private gameModel: any;

  private scene: THREE.Scene;

  private ambientLight: THREE.AmbientLight;

  private directionalLight: THREE.DirectionalLight;

  private pointLight: THREE.PointLight;

  private sunMesh: THREE.Mesh;

  private sunX: number;

  private sunZ: number;

  private sunIsAtZero: boolean;

  private sunHexes: Array<number>;

  private skyHexes: Array<number>;

  private currentHex: number;

  private hexInterval: any;

  private bindIterateHexes: any;

  constructor(gameModel: any) {
    this.gameModel = gameModel;
    this.scene = gameModel.scene;
    this.isNight = false;
    this.isLantern = false;
    this.isMorning = false;
    this.isEvening = true;
    this.sunHexes = [0xD71B1B, 0xE6392F, 0xEC6A56, 0xF39D80, 0xFAD5AD, 0xFFFCCD];
    this.skyHexes = [0x121B1F, 0x1A272D, 0x34505B, 0x517B8D, 0x69A0B7, 0x87CEEB];
    this.hexInterval = null;
    this.bindIterateHexes = this.iterateHexes.bind(this);
    this.sunIsAtZero = false;
  }

  public createLight() {
    this.scene.fog = new THREE.FogExp2(0x121B1F, 0.001);
    this.ambientLight = new THREE.AmbientLight(0xcccccc, 0.8);
    this.scene.add(this.ambientLight);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    const sphere = new THREE.SphereBufferGeometry(64, 16, 8);
    this.sunMesh = new THREE.Mesh(sphere, new THREE.MeshBasicMaterial(
      { color: 0xffffff, fog: false },
    ));
    this.directionalLight.add(this.sunMesh);

    this.directionalLight.position.set(0, 0, -1000);
    this.directionalLight.target.position.set(80, 0, 80);
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.camera.far = 2000;

    this.directionalLight.shadow.camera.left = -1000;
    this.directionalLight.shadow.camera.bottom = -1000;
    this.directionalLight.shadow.camera.right = 1000;
    this.directionalLight.shadow.camera.top = 1000;

    this.directionalLight.shadow.mapSize.width = 1024;
    this.directionalLight.shadow.mapSize.height = 1024;

    this.scene.add(this.directionalLight);
    this.scene.add(this.directionalLight.target);

    this.pointLight = new THREE.PointLight(0xFAEBA3, 2, 100, 1);
    this.pointLight.shadow.camera.far = 100;
  }

  public setSunligntPosition(position: THREE.Vector3) {
    this.sunX = position.x;
    this.sunZ = position.z;
    this.directionalLight.target.position.x = position.x;
    this.directionalLight.target.position.z = position.z;
    this.pointLight.position.set(position.x, position.y, position.z);
  }

  public setSunlightAngle(time: number) {
    const sinTime = Math.abs(Math.sin(time * SIN_MYLTIPLY));
    this.directionalLight.position.y = sinTime * MAX_SUN_Y;
    this.directionalLight.position.x = this.sunX + sinTime * MAX_SUN_X;
    this.directionalLight.position.z = this.sunZ + Math.cos(time * SIN_MYLTIPLY) * MIN_SUN_Z;

    if (sinTime < 0.01 && !this.sunIsAtZero) {
      this.changeLight();
      this.sunIsAtZero = true;
      setTimeout(() => {
        this.sunIsAtZero = false;
      }, TIMEOUT);
    }

    if (sinTime < SUNRISE_ANGLE) {
      if (!this.isNight && !this.isMorning) {
        this.isMorning = true;
        setTimeout(() => {
          this.isEvening = false;
        }, TIMEOUT);
        this.animateSunrise();
      }
      if (!this.isNight && !this.isEvening) {
        this.isEvening = true;
        setTimeout(() => {
          this.isMorning = false;
        }, TIMEOUT);
        this.animateDawn();
      }
    }
  }

  private iterateHexes() {
    const sunHex = this.sunHexes[this.currentHex];
    const skyHex = this.skyHexes[this.currentHex];
    (<any> this.sunMesh.material).color.setHex(sunHex);
    this.directionalLight.color.setHex(sunHex);
    this.scene.background = new THREE.Color(skyHex);
    this.scene.fog.color.setHex(skyHex);
    this.currentHex += 1;
    if (this.isMorning) {
      this.ambientLight.intensity = 0.1 + 0.05 * this.currentHex;
    } else {
      this.ambientLight.intensity = 0.35 - 0.05 * this.currentHex;
    }
    if (!this.sunHexes[this.currentHex] || !this.skyHexes[this.currentHex]) {
      clearInterval(this.hexInterval);
      this.sunHexes.reverse();
      this.skyHexes.reverse();
    }
  }

  private animateSunrise() {
    this.currentHex = 0;
    this.hexInterval = setInterval(this.bindIterateHexes, 4000);
  }

  private animateDawn() {
    this.currentHex = 0;
    this.hexInterval = setInterval(this.bindIterateHexes, 4000);
  }

  public addLanternToScene() {
    this.scene.add(this.pointLight);
  }

  public removeLanternFromScene() {
    this.scene.remove(this.pointLight);
  }

  public startDay() {
    this.setDay();
  }

  private changeLight() {
    if (this.isNight) {
      this.setDay();
    } else {
      this.setNight();
    }
    this.isNight = !this.isNight;
  }

  private setDay() {
    this.scene.background = new THREE.Color(0x121B1F);

    this.ambientLight.intensity = 0.1;
    this.ambientLight.color = new THREE.Color(0xcccccc);

    this.directionalLight.color.setHex(0xD71B1B);
    (<any> this.sunMesh.material).color.setHex(0xD71B1B);

    if (this.isLantern) {
      this.gameModel.hideLantern();
    }
    this.scene.add(this.directionalLight);
  }

  private setNight() {
    this.scene.fog = new THREE.FogExp2(0x000000, 0.001);
    this.scene.background = new THREE.Color(0x000000);

    this.ambientLight.intensity = 0.1;
    this.ambientLight.color = new THREE.Color(0xffffff);

    this.scene.remove(this.directionalLight);
  }
}

export default GameLight;
