import { Component, OnInit } from '@angular/core';
import * as BABYLON from 'babylonjs';
import { Engine, Scene } from 'babylonjs';
// import * as Materials from 'babylonjs-materials';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  canvas: any;
  camera: BABYLON.Camera; 
  light: BABYLON.PointLight;
  box: BABYLON.Mesh; 
  ground: BABYLON.Mesh;
  material : BABYLON.StandardMaterial;

  private engine: BABYLON.Engine; // The Babylon.js engine 
  private scene: BABYLON.Scene; // The scene where to add the nodes 
  

  //booleans
  toggleWireframe: boolean = false;
  toggleRotation: boolean = true;
  toggleBkg: boolean = false;

  constructor() { }

  ngOnInit() {
    this.canvas = document.getElementById("canvas");
    this.createScene();
  }

  createScene() {
    // Create engine 
    this.engine = new BABYLON.Engine(this.canvas); 
 
    // Create the scene 
    this.scene = new BABYLON.Scene(this.engine); 
    this.scene.clearColor = new BABYLON.Color4(0, 0, 0.2);  //if clearColor not specified then default background of scene - darkblue
 
    // Create the camera 
    this.camera = new BABYLON.ArcRotateCamera("camera", 0, 0, 30 , new BABYLON.Vector3(0, 0, 0),  this.scene);   // new BABYLON.Vector3(0,0,0) or BABYLON.Vector3.Zero()
    this.camera.attachControl(this.canvas, true); 
 
    // Create the light 
    this.light = new BABYLON.PointLight("light",new BABYLON.Vector3(20, 20, 50), this.scene); 
    this.light.diffuse = new BABYLON.Color3(0, 0.7, 0);  //green light
    this.light.specular = new BABYLON.Color3(1, 0, 1); 
    this.light.intensity = 1.0; 
    
    // Create Box mash
    this.box = BABYLON.Mesh.CreateBox("cube", 5, this.scene); 
    this.box.rotation.x = -0.2;
    // this.box.rotation.z = -0.2;
    this.box.position.y = 2.5;
    
    this.material = new BABYLON.StandardMaterial('material', this.scene)
    this.material.emissiveColor  = new BABYLON.Color3(0, 1, 1);
    this.material.diffuseColor = new BABYLON.Color3(1,0,0);
    this.material.specularColor = new BABYLON.Color3(1,0,0)
    // this.material.wireframe = true;
    this.box.material = this.material;

    // //create Ground mash
    // this.ground = BABYLON.Mesh.CreateGround("ground1", 15, 10, 2, this.scene);
    // this.ground.rotation.x = -0.2;
    
    //this.setSkybox()
    this.runRenderLoop();
  }

  public runRenderLoop(): void { 
    this.engine.runRenderLoop(() => { 
      this.scene.render(); 
    }); 
  }


  toggleWireframeMaterial() {
    this.toggleWireframe = !this.toggleWireframe;
    this.material.wireframe = this.toggleWireframe ? true : false;
  }

  toggleRotationAxis() {
    this.toggleRotation = !this.toggleRotation;
    this.toggleRotation ? this.box.rotation.z = -0.2 : this.box.rotation.z = 0 ;
  }
  
  changeBackground() {
    this.toggleBkg = !this.toggleBkg;
    this.material.emissiveColor = this.toggleBkg ? new BABYLON.Color3(0, 1 , 1) : new BABYLON.Color3(1, 1, 0)
  }




  setSkybox() {
    let skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:10.0}, this.scene);
    let  skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this.scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("../../../assets/textures/skybox", this.scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;
  }











}
