import { Component, OnInit } from '@angular/core';
import * as BABYLON from 'babylonjs';
import { Engine, Scene, GizmoManager } from 'babylonjs';

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

  gizmoManager: any;

  constructor() { }

  ngOnInit() {
    this.canvas = document.getElementById("canvas");
    this.createScene();
  }

  createScene() {
    this.engine = new BABYLON.Engine(this.canvas); 
    this.scene = new BABYLON.Scene(this.engine); 
    this.scene.clearColor = new BABYLON.Color4(0, 0, 0.2);  //if clearColor not specified then default bkg - darkblu

    // CAMERA
    this.camera = new BABYLON.ArcRotateCamera("camera", 0, 0, 30 , new BABYLON.Vector3(0, 0, 0),  this.scene);   // new BABYLON.Vector3(0,0,0) or BABYLON.Vector3.Zero()
    this.camera.attachControl(this.canvas, true); 
    this.camera.setTarget(BABYLON.Vector3.Zero());

    // LIGHT
    this.light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(20, 20, -50), this.scene); 
    this.light.diffuse = new BABYLON.Color3(1, 1, 1);  //white light
    this.light.intensity = 1.0; 
    
    // GROUND
    //  this.ground = BABYLON.Mesh.CreateGround("ground1", 20, 20, 2, this.scene);  
    //  this.ground.rotation.z = -5; 
    //  this.ground.position = new BABYLON.Vector3(1,5,0)
    //  let backgroundMaterial:any = new BABYLON.BackgroundMaterial("backgroundMaterial", this.scene);
    //  backgroundMaterial.diffuseTexture = new BABYLON.Texture("../../../assets/grass.jpg", this.scene);
    //  backgroundMaterial.diffuseTexture.uScale = 5.0; //Repeat 5 times on the Vertical Axes
    //  backgroundMaterial.diffuseTexture.vScale = 5.0; //Repeat 5 times on the Horizontal Axes
    //  backgroundMaterial.shadowLevel = 0.4;
    //  this.ground.material = backgroundMaterial;
     
    // BOX
    this.box = BABYLON.Mesh.CreateBox("cube", 5, this.scene); 
    this.material = new BABYLON.StandardMaterial('material', this.scene)
    // this.material.emissiveColor  = new BABYLON.Color3(1, 0, 1);
    this.material.diffuseTexture = new BABYLON.Texture('../../../assets/bricks.jpg', this.scene)
    this.box.material = this.material;
    this.box.position = new BABYLON.Vector3(2,5,2)
    // this.box.position.x = -5.2;
    this.box.rotation.y = Math.PI/2;
    this.box.parent = this.ground;

    let boxBlue = BABYLON.Mesh.CreateBox("boxBlue", 5, this.scene); 
    this.material = new BABYLON.StandardMaterial('material', this.scene)
    this.material.diffuseColor  = new BABYLON.Color3(0, 1, 0);
    boxBlue.position = new BABYLON.Vector3(0,-1,-1)

    this.gizmoManager = new BABYLON.GizmoManager(this.scene);
    this.gizmoManager.positionGizmoEnabled = true;
    this.gizmoManager.boundingBoxGizmoEnabled = true;

    //this.scene.removeMesh(this.box);  //throw awey box
    //this.mergeMeshes('mojMesh', , this.scene)
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




  mergeMeshes = (meshName, arrayObj, scene) =>{
    var arrayPos = [];
    var arrayNormal = [];
    var arrayUv = [];
    var arrayUv2 = [];
    var arrayColor = [];
    var arrayMatricesIndices = [];
    var arrayMatricesWeights = [];
    var arrayIndice = [];
    var savedPosition = [];
    var savedNormal = [];
    var newMesh = new BABYLON.Mesh(meshName, scene);
    var UVKind = true;
    var UV2Kind = true;
    var ColorKind = true;
    var MatricesIndicesKind = true;
    var MatricesWeightsKind = true;

    for (var i = 0; i != arrayObj.length ; i++) {
        if (!arrayObj[i].isVerticesDataPresent([BABYLON.VertexBuffer.UVKind]))
            UVKind = false;
        if (!arrayObj[i].isVerticesDataPresent([BABYLON.VertexBuffer.UV2Kind]))
            UV2Kind = false;
        if (!arrayObj[i].isVerticesDataPresent([BABYLON.VertexBuffer.ColorKind]))
            ColorKind = false;
        if (!arrayObj[i].isVerticesDataPresent([BABYLON.VertexBuffer.MatricesIndicesKind]))
            MatricesIndicesKind = false;
        if (!arrayObj[i].isVerticesDataPresent([BABYLON.VertexBuffer.MatricesWeightsKind]))
            MatricesWeightsKind = false;
    }

    for (i = 0; i != arrayObj.length ; i++) {
        var ite = 0;
        var iter = 0;
        arrayPos[i] = arrayObj[i].getVerticesData(BABYLON.VertexBuffer.PositionKind);
        arrayNormal[i] = arrayObj[i].getVerticesData(BABYLON.VertexBuffer.NormalKind);
        if (UVKind)
            arrayUv = arrayUv.concat(arrayObj[i].getVerticesData(BABYLON.VertexBuffer.UVKind));
        if (UV2Kind)
            arrayUv2 = arrayUv2.concat(arrayObj[i].getVerticesData(BABYLON.VertexBuffer.UV2Kind));
        if (ColorKind)
            arrayColor = arrayColor.concat(arrayObj[i].getVerticesData(BABYLON.VertexBuffer.ColorKind));
        if (MatricesIndicesKind)
            arrayMatricesIndices = arrayMatricesIndices.concat(arrayObj[i].getVerticesData(BABYLON.VertexBuffer.MatricesIndicesKind));
        if (MatricesWeightsKind)
            arrayMatricesWeights = arrayMatricesWeights.concat(arrayObj[i].getVerticesData(BABYLON.VertexBuffer.MatricesWeightsKind));

        var maxValue = savedPosition.length / 3;

        arrayObj[i].computeWorldMatrix(true);
        var worldMatrix = arrayObj[i].getWorldMatrix();

        for (var ite = 0 ; ite != arrayPos[i].length; ite += 3) {
            var vertex = BABYLON.Vector3.TransformCoordinates(new BABYLON.Vector3(arrayPos[i][ite], arrayPos[i][ite + 1], arrayPos[i][ite + 2]), worldMatrix);
            savedPosition.push(vertex.x);
            savedPosition.push(vertex.y);
            savedPosition.push(vertex.z);
        }

        for (var iter = 0 ; iter != arrayNormal[i].length; iter += 3) {
            var vertex = BABYLON.Vector3.TransformNormal(new BABYLON.Vector3(arrayNormal[i][iter], arrayNormal[i][iter + 1], arrayNormal[i][iter + 2]), worldMatrix);
            savedNormal.push(vertex.x);
            savedNormal.push(vertex.y);
            savedNormal.push(vertex.z);
        }

        var tmp = arrayObj[i].getIndices();
        for (let it = 0 ; it != tmp.length; it++) {
            arrayIndice.push(tmp[it] + maxValue);
        }
        arrayIndice = arrayIndice.concat(tmp);

        arrayObj[i].dispose(false);
    }

    newMesh.setVerticesData(BABYLON.VertexBuffer.PositionKind, savedPosition, false);
    newMesh.setVerticesData(BABYLON.VertexBuffer.NormalKind, savedNormal, false);
    if (arrayUv.length > 0)
        newMesh.setVerticesData(BABYLON.VertexBuffer.UVKind, arrayUv, false);
    if (arrayUv2.length > 0)
        newMesh.setVerticesData(BABYLON.VertexBuffer.UV2Kind, arrayUv, false);
    if (arrayColor.length > 0)
        newMesh.setVerticesData(BABYLON.VertexBuffer.ColorKind, arrayUv, false);
    if (arrayMatricesIndices.length > 0)
        newMesh.setVerticesData(BABYLON.VertexBuffer.MatricesIndicesKind, arrayUv, false);
    if (arrayMatricesWeights.length > 0)
        newMesh.setVerticesData(BABYLON.VertexBuffer.MatricesWeightsKind, arrayUv, false);

    newMesh.setIndices(arrayIndice);
    return newMesh;
  }
  




}
