import { Component, OnInit } from '@angular/core';

import * as BABYLON from 'babylonjs';
import { Engine, Scene } from 'babylonjs';

@Component({
  selector: 'app-coordinate-system',
  templateUrl: './coordinate-system.component.html',
  styleUrls: ['./coordinate-system.component.scss']
})
export class CoordinateSystemComponent implements OnInit {
  private engine: BABYLON.Engine; 
  private scene: BABYLON.Scene;
  
  canvas: any;
  camera: BABYLON.ArcRotateCamera; 
  light: BABYLON.HemisphericLight;
  material : BABYLON.StandardMaterial;
  box: BABYLON.Mesh; 
  verticesMesh: any;//BABYLON.Mesh;

  constructor() { }

  ngOnInit() {
    this.canvas = document.getElementById("canvas");
    this.createScene();
    this.runRenderLoop();
  }

  createScene() {
    this.engine = new BABYLON.Engine(this.canvas); 
    this.scene = new BABYLON.Scene(this.engine); 
    this.scene.clearColor = new BABYLON.Color4(1 , 1, 1); //black
 
    this.camera = new BABYLON.ArcRotateCamera("camera", -Math.PI/3, 15*Math.PI/32, 16, new BABYLON.Vector3(2,3,4), this.scene);  
    this.camera.attachControl(this.canvas, true); 
 
    this.light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), this.scene); 
    this.light.intensity = 0.8; 

    this.createBoxesMeshes();
  }

  createBoxesMeshes() {
    this.box = BABYLON.MeshBuilder.CreateBox("box", {'size': 2}, this.scene); 
    this.material = new BABYLON.StandardMaterial('material', this.scene)
    this.material.emissiveColor  = new BABYLON.Color3(0.2, 0.2, 0.2);
    this.box.material = this.material;
    this.box.position = new BABYLON.Vector3(2, 3, 2);  // translate the position of the box to (2,3,4)

     // create world axis
    this.createAxis(8, this.scene);

    // create local axis and position them to where the position of the box
    let axis_origin = this.createLocalAxes(4, this.scene);
    axis_origin.parent = this.box;

    this.scene.registerAfterRender(() => {
      this.rotateCube();
    });
  }

  //create local coord system
  createLocalAxes(size, scene){
    let [local_axisX, local_axisY, local_axisZ] = this.createAxis(size, scene);
    let origin = new BABYLON.TransformNode("origin");
    local_axisX.parent = origin;
    local_axisY.parent = origin;
    local_axisZ.parent = origin;
    
    return origin;
  }

   //create coord system
   createAxis(size, scene) {

    let makeTextPlane = (text, color, size ) => {
      let dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 50, scene, true);
      dynamicTexture.hasAlpha = true;
      dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color , "transparent", true);

      let plane:any = BABYLON.MeshBuilder.CreatePlane("TextPlane", {size: size, updatable: true}, scene);
      plane.material = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
      plane.material.specularColor = new BABYLON.Color3(0, 0, 0);
      plane.material.diffuseTexture = dynamicTexture;
      plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;

      return plane;
    };

    let axisX = BABYLON.Mesh.CreateLines("axisX", [
      BABYLON.Vector3.Zero(),
      new BABYLON.Vector3(size, 0, 0),
      new BABYLON.Vector3(size * 0.95, 0.05 * size, 0),
      new BABYLON.Vector3(size, 0, 0),
      new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
      ], scene);
    axisX.color = new BABYLON.Color3(1, 0, 0);

    let xChar = makeTextPlane("X", "red", size / 8);
    xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0);
    xChar.parent = axisX;

    let axisY = BABYLON.Mesh.CreateLines("axisY", [
      BABYLON.Vector3.Zero(),
      new BABYLON.Vector3(0, size, 0),
      new BABYLON.Vector3( -0.05 * size, size * 0.95, 0),
      new BABYLON.Vector3(0, size, 0),
      new BABYLON.Vector3( 0.05 * size, size * 0.95, 0)
      ], scene);
    axisY.color = new BABYLON.Color3(0, 1, 0);

    let yChar = makeTextPlane("Y", "green", size / 8);
    yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);
    yChar.parent = axisY;

    let axisZ = BABYLON.Mesh.CreateLines("axisZ", [
      BABYLON.Vector3.Zero(),
      new BABYLON.Vector3(0, 0, size),
      new BABYLON.Vector3( 0 , -0.05 * size, size * 0.95),
      new BABYLON.Vector3(0, 0, size),
      new BABYLON.Vector3( 0, 0.05 * size, size * 0.95)
      ], scene);
    axisZ.color = new BABYLON.Color3(0, 0, 1);

    let zChar = makeTextPlane("Z", "blue", size / 8);
    zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);
    zChar.parent = axisZ;

    return [axisX, axisY, axisZ];
  }


  rotateCube(){
    let children = this.box.getChildMeshes(false, (node) => { return node.name == "TextPlane"; });
    for (let child of children) {
      let a = Math.PI / 1000;
      let pos = child.position;
      let newX = pos.z *Math.sin(a) + pos.x * Math.cos(a);
      let newZ = pos.z * Math.cos(a) - pos.x * Math.sin(a);
      child.position = new BABYLON.Vector3(newX, pos.y, newZ);
    }
    this.box.rotate(BABYLON.Axis.Y, Math.PI / 1000, BABYLON.Space.LOCAL);
  }


  runRenderLoop(): void { 
    this.engine.runRenderLoop(() => { 
      this.scene.render(); 
    }); 
  }


  showHideBoxMeshes() {
    this.verticesMesh.setEnabled(false);
    this.box.setEnabled((this.box.isEnabled() ? false : true ));
    // let box = this.scene.getMeshByID('box');
    // if(box) {
    //   // let children = box.getChildMeshes();
    //   // children.forEach((el:any) => el.setEnabled((box.isEnabled() ? false : true )));
    //   box.setEnabled((box.isEnabled() ? false : true ));
    // }
  }


  //create Vertices mash plane
  createVertices() {
    this.box.setEnabled(false);
    this.createVerticesMesh();
  }

  createVerticesMesh() {
    let positions = [
      10, 10, 0,      // (x,y,z) for vertex 0
      -10, 10, 0,     // (x,y,z) for vertex 1
      -10, -10, 0,    // (x,y,z) for vertex 2
      10, -10, 0      // (x,y,z) for vertex 3
    ];

    let indices = [
      0, 1, 2,        // facet 0
      2, 3, 0         // facet 1
    ];

    let colors = [
      1, 0, 0, 1,     // red for vertex 0
      1, 0, 0, 1,     // red for vertex 1
      1, 0, 0, 1,     // red for vertex 2
      0, 1, 0, 1      // green for vertex 3
    ];

    let normals = [
      0, 0, -1,     // <0,0,-1> for vertex 0
      0, 0, -1,     // <0,0,-1> for vertex 1
      0, 0, -1,     // <0,0,-1> for vertex 2
      0, 0, -1      // <0,0,-1> for vertex 3
    ];

    let vertexData = new BABYLON.VertexData();
    vertexData.positions = positions;  //this is vertex buffer (niz pozicija)
    vertexData.indices = indices;
    vertexData.colors = colors;
    vertexData.normals = normals;

    this.verticesMesh = new BABYLON.Mesh("verticesMesh", this.scene);
    vertexData.applyToMesh(this.verticesMesh);

    this.verticesMesh.material = new BABYLON.StandardMaterial('mat', this.scene);
    this.verticesMesh.material.specularColor = new BABYLON.Color3(0, 0, 0);
    //this.verticesMesh.material.sideOrientation = BABYLON.Material.ClockWiseSideOrientation;
    this.verticesMesh.setEnabled(true);
    
    this.createPositionableLabels(this.scene)
  }

  createPositionableLabels(scene) {
    this.createPositionableLabel(scene, "0", new BABYLON.Vector3(12,12,0));
    this.createPositionableLabel(scene, "1", new BABYLON.Vector3(-12,12,0));
    this.createPositionableLabel(scene, "2", new BABYLON.Vector3(-12,-12,0));
    this.createPositionableLabel(scene, "3", new BABYLON.Vector3(12,-12,0));
  }

  createPositionableLabel(scene, text, position) {  //the sam func as makeTextPlane
    let texture = new BABYLON.DynamicTexture("dtex", 512, scene, true);
    texture.drawText(text, 200, 320, "bold 200px Segoe UI", "white", "transparent", true); 
    texture.hasAlpha = true;

    let plane:any = BABYLON.Mesh.CreatePlane("plane", 10.0, scene, false, BABYLON.Mesh.DEFAULTSIDE);
    plane.position = position;
    plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
    plane.material = new BABYLON.StandardMaterial("mat", scene);
    plane.material.diffuseTexture = texture;

    plane.parent  = this.verticesMesh;
   }



   applyTranslationROtationScaling() {
    //TRANSITION
    this.box.position.y += 0.3;
    // Methods:
    /*
      mesh.position
      mesh.position.x 
      mesh.position.y 
      mesh.position.z
      mesh.setPositionWithLocalVector()
      mesh.locallyTranslate()
      mesh.translate()
    */

    //ROTATION
    this.box.rotate(BABYLON.Axis.Z, 0.3, BABYLON.Space.LOCAL);
    // Methods: 
    /*
      mesh.rotation 
      mesh.rotation.x 
      mesh.rotation.y 
      mesh.rotation.z
      mesh.rotationQuaternion
      mesh.rotate()
      mesh.addRotation()
      Vector3.RotationFromAxis() Vector3.RotationFromAxisToRef()
      Quaternion.RotationQuaternionFromAxis() Quaternion.RotationQuaternionFromAxisToRef()
    */

    //SCALING
    this.box.scaling.y += 0.2;
    // mesh.scaling  
    // mesh.scaling.x 
    // mesh.scaling.y 
    // mesh.scaling.z

  }




}
