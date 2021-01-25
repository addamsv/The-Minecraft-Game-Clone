import * as THREE from 'three';

class GameLight {
  gameModel: any;

  private scene: THREE.Scene;

  private ambientLight: THREE.AmbientLight;

  directionalLight: THREE.DirectionalLight;

  private pointLight: THREE.PointLight;

  private isNight: boolean;

  shadowCamera: THREE.Camera;

  sunX: number;

  sunZ: number;

  sunIsAtZero: boolean;

  constructor(gameModel: any) {
    this.gameModel = gameModel;
    this.scene = gameModel.scene;
    this.isNight = false;
    this.sunX = 0;
    this.sunZ = -1000;
  }

  public createLight() {
    this.scene.fog = new THREE.FogExp2(0xffffff, 0.001);
    this.scene.background = new THREE.Color(0x87CEEB);
    this.ambientLight = new THREE.AmbientLight(0xcccccc, 0.8);
    this.scene.add(this.ambientLight);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    const sphere = new THREE.SphereBufferGeometry(64, 16, 8);
    this.directionalLight.add(
      new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0xffffff })),
    );

    // this.directionalLight.position.set(580, 1000, 580);
    this.directionalLight.position.set(0, 100, -1000);
    this.directionalLight.target.position.set(80, 0, 80);
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.camera.far = 2000;

    this.directionalLight.shadow.camera.left = -1000;
    this.directionalLight.shadow.camera.bottom = -1000;
    this.directionalLight.shadow.camera.right = 1000;
    this.directionalLight.shadow.camera.top = 1000;

    this.directionalLight.shadow.mapSize.width = 2048;
    this.directionalLight.shadow.mapSize.height = 2048;

    this.scene.add(this.directionalLight);
    this.scene.add(this.directionalLight.target);

    this.pointLight = new THREE.PointLight(0xFAEBA3, 2, 100, 1);
    this.pointLight.castShadow = true;
    this.pointLight.shadow.camera.far = 100;
  }

  public checkNight() {
    return this.isNight;
  }

  public setSunligntPosition(position: THREE.Vector3) {
    this.sunX = position.x;
    this.sunZ = position.z;
    // this.directionalLight.position.x = position.x + 500;
    // this.directionalLight.position.z = position.z + 500;
    this.directionalLight.target.position.x = position.x;
    this.directionalLight.target.position.z = position.z;
  }

  public setSunlightAngle(time: number) {
    const sinTime = Math.abs(Math.sin(time * 0.00001));
    this.directionalLight.position.y = sinTime * 1000;
    this.directionalLight.position.x = this.sunX + sinTime * 200;
    this.directionalLight.position.z = this.sunZ + Math.cos(time * 0.00001) * -1000;
    if (sinTime < 0.01 && !this.sunIsAtZero) {
      this.changeLight();
      this.sunIsAtZero = true;
      setTimeout(() => {
        this.sunIsAtZero = false;
      }, 10000);
    }
  }

  public lightFollowCamera(position: THREE.Vector3) {
    this.pointLight.position.set(position.x, position.y, position.z);
  }

  public addLanternToScene() {
    this.scene.add(this.pointLight);
  }

  public removeLanternFromScene() {
    this.scene.remove(this.pointLight);
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
    this.scene.fog = new THREE.FogExp2(0xffffff, 0.001);
    this.scene.background = new THREE.Color(0x87CEEB);
    this.ambientLight.intensity = 0.8;
    this.ambientLight.color = new THREE.Color(0xcccccc);

    this.gameModel.hideLantern();
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
