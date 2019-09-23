import { Component, OnInit } from '@angular/core';
import * as BABYLON from 'babylonjs';
import { Engine, Scene } from 'babylonjs';

@Component({
  selector: 'app-texture',
  templateUrl: './texture.component.html',
  styleUrls: ['./texture.component.scss']
})
export class TextureComponent implements OnInit {
  
  private engine: BABYLON.Engine; // The Babylon.js engine 
  private scene: BABYLON.Scene; // The scene where to add the nodes 
  
  canvas: any;
  camera: BABYLON.ArcRotateCamera; 
  light: BABYLON.HemisphericLight;//BABYLON.PointLight;
  box: BABYLON.Mesh; 
  ground: BABYLON.Mesh;
  material : BABYLON.StandardMaterial;

  //booleans
  toggleWireframe: boolean = false;
  toggleRotation: boolean = true;
  toggleBkg: boolean = false;
  toggleTexture: boolean = false;

  constructor() { }

  ngOnInit() {
    this.canvas = document.getElementById("canvas");
    this.createScene();
  }

  createScene() {
    this.engine = new BABYLON.Engine(this.canvas); 
    this.scene = new BABYLON.Scene(this.engine); 
    this.scene.clearColor = new BABYLON.Color4(0, 0, 0.2);  //if clearColor not specified then default bkg - darkblue
 
    // CAMERA
    this.camera = new BABYLON.ArcRotateCamera("camera", 0, 0, 30 , new BABYLON.Vector3(0, 0, 0),  this.scene);   // new BABYLON.Vector3(0,0,0) or BABYLON.Vector3.Zero()
    this.camera.attachControl(this.canvas, true); 
    this.camera.setTarget(BABYLON.Vector3.Zero());

    // LIGHT
    this.light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(20, 20, -50), this.scene); 
    this.light.diffuse = new BABYLON.Color3(1, 1, 1);  //white light
    this.light.intensity = 1.0; 
    
     // GROUND
     this.ground = BABYLON.Mesh.CreateGround("ground1", 20, 20, 2, this.scene);
     this.ground.rotation.z = -5; 
     this.ground.position = new BABYLON.Vector3(1,5,0)
     let backgroundMaterial:any = new BABYLON.BackgroundMaterial("backgroundMaterial", this.scene);
     backgroundMaterial.diffuseTexture = new BABYLON.Texture("../../../assets/grass.jpg", this.scene);
     backgroundMaterial.diffuseTexture.uScale = 5.0; //Repeat 5 times on the Vertical Axes
     backgroundMaterial.diffuseTexture.vScale = 5.0; //Repeat 5 times on the Horizontal Axes
     backgroundMaterial.shadowLevel = 0.4;
     this.ground.material = backgroundMaterial;
     
    // BOX
    this.box = BABYLON.Mesh.CreateBox("cube", 10, this.scene); 
    this.material = new BABYLON.StandardMaterial('material', this.scene)
    // this.material.emissiveColor  = new BABYLON.Color3(1, 0, 1);
    this.material.diffuseTexture = new BABYLON.Texture('../../../assets/bricks.jpg', this.scene)
    this.box.material = this.material;
    this.box.position = new BABYLON.Vector3(1,5,0)
    // this.box.position.x = -5.2;
    this.box.rotation.y = Math.PI/2;
    this.box.parent = this.ground;

    //this.scene.removeMesh(this.box);  //throw awey box
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
    this.toggleRotation ? this.ground.rotation.x = Math.PI/4 : this.box.rotation.z = 0 ;
   //this.box.rotate(BABYLON.Axis.Z, 0.3, BABYLON.Space.LOCAL);
  }
  
  changeBackground() {
    this.toggleBkg = !this.toggleBkg;
    this.material.emissiveColor = this.toggleBkg ? new BABYLON.Color3(1, 0 , 1) : new BABYLON.Color3(1, 1, 0)
  }


  




}
