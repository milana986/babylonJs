import { Component, OnInit } from '@angular/core';

import * as BABYLON from 'babylonjs';
import { Engine, Scene } from 'babylonjs';

@Component({
  selector: 'app-extrude',
  templateUrl: './extrude.component.html',
  styleUrls: ['./extrude.component.scss']
})
export class ExtrudeComponent implements OnInit {
  engine: BABYLON.Engine; // The Babylon.js engine 
  scene: BABYLON.Scene; // The scene where to add the nodes 

  canvas: any;
  camera: BABYLON.Camera; 
  light: BABYLON.HemisphericLight;

  imgPath: string = '../../../assets/house/';

  constructor() { }

  ngOnInit() {
    this.canvas = document.getElementById("canvas");
    this.createScene();
  }


  createScene() {
    this.engine = new BABYLON.Engine(this.canvas); 
    this.scene = new BABYLON.Scene(this.engine); 
    this.scene.clearColor = new BABYLON.Color4(0, 0, 0.2);  //if clearColor not specified then default background of scene - darkblue
    this.camera = new BABYLON.ArcRotateCamera("camera", 0, Math.PI/3, 30 , new BABYLON.Vector3(0, 0, 0),  this.scene);   // new BABYLON.Vector3(0,0,0) or BABYLON.Vector3.Zero()
    this.camera.attachControl(this.canvas, true); 
    this.light = new BABYLON.HemisphericLight("light",new BABYLON.Vector3(10, 10, 0), this.scene); 

    this.buildHouse();
    this.runRenderLoop();
  }

  public runRenderLoop(): void { 
    this.engine.runRenderLoop(() => { 
      this.scene.render(); 
    }); 
  }

  buildHouse() {
    this.addFloor();
  }


  //BABYLON.MeshBuilder.ExtrudePolygon("wall", {shape:x, depth: y, holes:z, faceUV: o }, scene);
  addFloor() {
    let floorValues = [
      new BABYLON.Vector3(14,0,5),
      new BABYLON.Vector3(-14,0,5),
      new BABYLON.Vector3(-14,0,-5),
      new BABYLON.Vector3(14,0,-5),
    ];

    let faceUV = new Array(3);
    faceUV[0] = new BABYLON.Vector4(0, 0, 7/15, 1);
    faceUV[1] = new BABYLON.Vector4(14/15, 0, 1, 1);
    faceUV[2] = new BABYLON.Vector4(7/15, 0, 14/15, 1);
    
    let floor = BABYLON.MeshBuilder.ExtrudePolygon('floor' , {shape: floorValues, depth: 0.20, faceUV: faceUV }, this.scene);
    let floorMaterial:any = new BABYLON.StandardMaterial('mat', this.scene);
    floorMaterial.diffuseTexture = new BABYLON.Texture(`${this.imgPath}parket.jpg`, this.scene);
    floorMaterial.diffuseTexture.uScale = 15.0; 
    floorMaterial.diffuseTexture.vScale = 10.0; 
    floor.material = floorMaterial;
    floor.rotation.y = Math.PI/2;
  }





}
