import { Component, OnInit } from '@angular/core';

import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';
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

  faceUV: any[];
  //walls
  backWall:any;
  backWall2: any;
  plafon:any;
  roof: any;
  leftSideWall:any;
  rightSideWall:any;
  leftInnerWall:any;
  rightInnerWall:any;
  frontWall:any;

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
    this.addFloorPlafonBackWalls();
    this.addRightLeftSideWalls()
    this.addRoof();
    this.addInnerWalls();
    this.addBathroomWalls();
    this.addFrontWall();
    this.setGUI();
  }

  getFaceUV() {
    this.faceUV = new Array(3);
    this.faceUV[0] = new BABYLON.Vector4(0, 0, 7/15, 1);
    this.faceUV[1] = new BABYLON.Vector4(14/15, 0, 1, 1);
    this.faceUV[2] = new BABYLON.Vector4(7/15, 0, 14/15, 1);
  }


  //BABYLON.MeshBuilder.ExtrudePolygon("wall", {shape:x, depth: y, holes:z, faceUV: o }, scene);
  addFloorPlafonBackWalls() {
    let floorValues = [
      new BABYLON.Vector3(8.7, 0, 2.5),
      new BABYLON.Vector3(-8.7, 0, 2.5),
      new BABYLON.Vector3(-8.7, 0, -2.5),
      new BABYLON.Vector3(8.7 , 0, -2.5)
    ];

    let floor = BABYLON.MeshBuilder.ExtrudePolygon('floor' , {shape: floorValues, depth: 0.10, faceUV: this.faceUV }, this.scene);
    let floorMaterial:any = new BABYLON.StandardMaterial('matFloor', this.scene);
    floorMaterial.diffuseTexture = new BABYLON.Texture(`${this.imgPath}parket.jpg`, this.scene);
    floorMaterial.diffuseTexture.uScale = 15.0; 
    floorMaterial.diffuseTexture.vScale = 10.0; 
    floor.material = floorMaterial;
    floor.rotation.y = Math.PI/2;
    floor.position.y = 0.1

    // house base
    let baseValuse = [
      new BABYLON.Vector3(9, 0, 2.7),
      new BABYLON.Vector3(-9, 0, 2.7),
      new BABYLON.Vector3(-9, 0, -2.7),
      new BABYLON.Vector3(9, 0, -2.7)
    ];
    let base:any = BABYLON.MeshBuilder.ExtrudePolygon('base' , {shape: baseValuse, depth: 0.90, faceUV: this.faceUV }, this.scene);
    base.material = new BABYLON.StandardMaterial('matBase', this.scene);
    base.material.diffuseColor =  new BABYLON.Color3(0.5, 0.5, 0.5);
    base.rotation.y = Math.PI/2;
    base.position.y = 0;
    base.position.x = 0.03;


    //back wall
    let backValues = [
      new BABYLON.Vector3(9, 0,2.4),
      new BABYLON.Vector3(-9, 0,2.4),
      new BABYLON.Vector3(-9, 0,-2.4),
      new BABYLON.Vector3(9, 0,-2.4)
    ];
    this.backWall = BABYLON.MeshBuilder.ExtrudePolygon('back' , {shape: backValues, depth: 0.20, faceUV: this.faceUV }, this.scene);
    this.backWall.material = new BABYLON.StandardMaterial('matBack', this.scene);
    //this.backWall.material.diffuseColor = new BABYLON.Color3(0.7,0.7,0.7)
    this.backWall.rotation.y = Math.PI/2;
    this.backWall.rotation.x = Math.PI/2;
    this.backWall.position.x = -2.4;
    this.backWall.position.y = 2.4;

    //back wall
    let backUpperValues = [
      new BABYLON.Vector3(9, 0, 1.5),
      new BABYLON.Vector3(-9, 0, 1.5),
      new BABYLON.Vector3(-9, 0, -1.5),
      new BABYLON.Vector3(9, 0, -1.5)
    ];
    this.backWall2 = BABYLON.MeshBuilder.ExtrudePolygon('backUpperWall' , {shape: backUpperValues, depth: 0.20, faceUV: this.faceUV }, this.scene);
    this.backWall2.material = new BABYLON.StandardMaterial('matBackUpper', this.scene);
    //this.backWall2.material.diffuseColor = new BABYLON.Color3(0.7,0.7,0.7)
    this.backWall2.rotation.y = Math.PI/2;
    this.backWall2.rotation.x = Math.PI/2;
    this.backWall2.position.x = -2.4;
    this.backWall2.position.y = 5;

    //plafond wall
    let plafonValues = [
      new BABYLON.Vector3(9,0,2.5),
      new BABYLON.Vector3(-9,0,2.5),
      new BABYLON.Vector3(-9,0,-2.5),
      new BABYLON.Vector3(9,0,-2.5)
    ];
    
    this.plafon = BABYLON.MeshBuilder.ExtrudePolygon('plafond' , {shape: plafonValues, depth: 0.40, faceUV: this.faceUV }, this.scene);
    this.plafon.material = new BABYLON.StandardMaterial('matPlafond', this.scene);
    this.plafon.rotation.y = Math.PI/2;
    this.plafon.position.y = 4.8;
  }

  addRoof(){
    let roofValues = [
      new BABYLON.Vector3(3, 0, 9),
      new BABYLON.Vector3(-3, 0, 9),
      new BABYLON.Vector3(-3, 0, -9),
      new BABYLON.Vector3(3, 0, -9)
    ];
    this.roof = BABYLON.MeshBuilder.ExtrudePolygon("roof", {shape:roofValues, depth: 0.1, faceUV: this.faceUV}, this.scene);
    let roofmat:any = new BABYLON.StandardMaterial("roofmat", this.scene);
    roofmat.diffuseTexture = new BABYLON.Texture(`${this.imgPath}roof.jpg`, this.scene);
    this.roof.material = roofmat;
    this.roof.rotation.z = -Math.PI/10;
    this.roof.position.y = 5.8;
  }


  addRightLeftSideWalls() {
    let sideValues = [
      new BABYLON.Vector3(2.3,0,2.5),
      new BABYLON.Vector3(-2.3,0,2.5),
      new BABYLON.Vector3(-2.3,0,-2.5),
      new BABYLON.Vector3(2.3,0,-2.5)
    ];

    this.leftSideWall = BABYLON.MeshBuilder.ExtrudePolygon('leftSide' , {shape: sideValues, depth: 0.30, faceUV: this.faceUV }, this.scene);
    this.leftSideWall.material = new BABYLON.StandardMaterial('matLeft', this.scene);
    this.leftSideWall.rotation.y = -Math.PI/2
    this.leftSideWall.rotation.z = Math.PI/2;
    this.leftSideWall.position.z = -9;
    this.leftSideWall.position.y = 2.3;

    this.rightSideWall = BABYLON.MeshBuilder.ExtrudePolygon('rightSide' , {shape: sideValues, depth: 0.30, faceUV: this.faceUV }, this.scene);
    this.rightSideWall.material = new BABYLON.StandardMaterial('matRight', this.scene);
    this.rightSideWall.rotation.y = Math.PI/2
    this.rightSideWall.rotation.z = Math.PI/2;
    this.rightSideWall.position.z = 9;
    this.rightSideWall.position.y = 2.3;
    
  }

  addInnerWalls() {
    let leftInnerValues = [
      new BABYLON.Vector3(2.3,0,2.5),
      new BABYLON.Vector3(-2.3,0,2.5),
      //------- holes ------
      new BABYLON.Vector3(-2.3, 0, 1.7),
      new BABYLON.Vector3(1, 0, 1.7),
      new BABYLON.Vector3(1, 0, 0.5),
      new BABYLON.Vector3(-2.3, 0, 0.5),
      //--------------------
      new BABYLON.Vector3(-2.3, 0, -2.5),
      new BABYLON.Vector3(2.3,0,-2.5)
    ];
    let rightInnerValues = [
      new BABYLON.Vector3(2.3,0,2.5),
      new BABYLON.Vector3(-2.3,0,2.5),
      new BABYLON.Vector3(-2.3, 0, 1.5),
      new BABYLON.Vector3(1, 0, 1.5),
      new BABYLON.Vector3(1, 0, 0.2),
      new BABYLON.Vector3(-2.3, 0, 0.2),
      new BABYLON.Vector3(-2.3, 0, -2.5),
      new BABYLON.Vector3(2.3,0,-2.5)
    ];

    this.leftInnerWall = BABYLON.MeshBuilder.ExtrudePolygon('leftInnerWall' , {shape: leftInnerValues, depth: 0.08, faceUV: this.faceUV }, this.scene);
    this.leftInnerWall.material = new BABYLON.StandardMaterial('matLeftInner', this.scene);
    this.leftInnerWall.rotation.y = Math.PI/2
    this.leftInnerWall.rotation.z = Math.PI/2;
    this.leftInnerWall.position.z = -5.5;
    this.leftInnerWall.position.y = 2.3;

    this.rightInnerWall = BABYLON.MeshBuilder.ExtrudePolygon('leftInnerWall' , {shape: rightInnerValues, depth: 0.08, faceUV: this.faceUV }, this.scene);
    this.rightInnerWall.material = new BABYLON.StandardMaterial('matLeftInner', this.scene);
    this.rightInnerWall.rotation.y = Math.PI/2
    this.rightInnerWall.rotation.z = Math.PI/2;
    this.rightInnerWall.position.z = 5.5;
    this.rightInnerWall.position.y = 2.3;
  }
    

  addBathroomWalls() {
    let leftBathValues = [
      new BABYLON.Vector3(2.3,0,2.5),
      new BABYLON.Vector3(-2.3,0,2.5),
      new BABYLON.Vector3(-2.3, 0, 0),
      new BABYLON.Vector3(2.3,0,0)
    ];
    let frontBathValues = [
      new BABYLON.Vector3(2.3,0,2.5),
      new BABYLON.Vector3(-2.3,0,2.5),
      new BABYLON.Vector3(-2.3, 0, 1.5),
      new BABYLON.Vector3(1, 0, 1.5),
      new BABYLON.Vector3(1, 0, 0.2),
      new BABYLON.Vector3(-2.3, 0, 0.2),
      new BABYLON.Vector3(-2.3, 0, 0),
      new BABYLON.Vector3(2.3,0,0)
    ];

    let leftBathWall = BABYLON.MeshBuilder.ExtrudePolygon('leftBathWall' , {shape: leftBathValues, depth: 0.08, faceUV: this.faceUV }, this.scene);
    leftBathWall.material = new BABYLON.StandardMaterial('matLeftInner', this.scene);
    leftBathWall.rotation.y = -Math.PI/2
    leftBathWall.rotation.z = -Math.PI/2;
    leftBathWall.position.z = -3;
    leftBathWall.position.y = 2.3;

    let frontBathWall:any = BABYLON.MeshBuilder.ExtrudePolygon('frontBathWall' , {shape: frontBathValues, depth: 0.08, faceUV: this.faceUV }, this.scene);
    frontBathWall.material = new BABYLON.StandardMaterial('matLeftInner', this.scene);
    frontBathWall.material.diffuseColor = new BABYLON.Color3(0.6, 0.6, 0.6);
    frontBathWall.position.z = -5.5;
    frontBathWall.position.y = 2.3;
    frontBathWall.rotation.z = Math.PI/2;
  }

 
  addFrontWall() {
    //front wall
    let frontValues = [
      new BABYLON.Vector3(9, 0,2.4),
      new BABYLON.Vector3(-9, 0,2.4),
      new BABYLON.Vector3(-9, 0,-2.4),
      new BABYLON.Vector3(9, 0,-2.4)
    ];
    let leftWindow = [
      new BABYLON.Vector3(8,0,1),
      new BABYLON.Vector3(8,0,-1),
      new BABYLON.Vector3(6.5,0,-1),
      new BABYLON.Vector3(6.5,0,1)
    ];
    let rightWindow = [
      new BABYLON.Vector3(-8,0,1),
      new BABYLON.Vector3(-8,0,-1),
      new BABYLON.Vector3(-6.5,0,-1),
      new BABYLON.Vector3(-6.5,0,1)
    ];
    let livingRoomWindow = [
      new BABYLON.Vector3(-1,0,1),
      new BABYLON.Vector3(-1,0,-1),
      new BABYLON.Vector3(-4,0,-1),
      new BABYLON.Vector3(-4,0,1)
    ]

    this.frontWall = BABYLON.MeshBuilder.ExtrudePolygon('front' , {shape: frontValues, holes: [leftWindow, rightWindow, livingRoomWindow] , depth: 0.20, faceUV: this.faceUV }, this.scene);
    this.frontWall.material = new BABYLON.StandardMaterial('matBack', this.scene);
    this.frontWall.material.diffuseColor = BABYLON.Color3.Yellow();
    this.frontWall.rotation.y = Math.PI/2;
    this.frontWall.rotation.x = Math.PI/2;
    this.frontWall.position.x = 2.7;
    this.frontWall.position.y = 2.4;
  }


  setGUI(){
    //GUI
    let myGUI = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    var panel = new GUI.StackPanel();
    panel.width = "210px";
    panel.paddingLeft = "10px";
    panel.isVertical = true;
    panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    panel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;    
    myGUI.addControl(panel);

    let panelHeading = new GUI.StackPanel();
    panelHeading.width = "150px";
    panelHeading.height = "45px";
    panelHeading.isVertical = false;
    panelHeading.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    panelHeading.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;    
    panel.addControl(panelHeading);

    let heading = new GUI.TextBlock();
    heading.text = "Toggle Visibility";
    heading.width = "180px";
    heading.height = "40px"
    heading.paddingLeft = "10px";
    heading.paddingBottom = "15px";
    heading.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    heading.color = "white";
    panelHeading.addControl(heading); 

    let panelRoof = new GUI.StackPanel();
    panelRoof.width = "150px";
    panelRoof.height = "25px";
    panelRoof.isVertical = false;
    panelRoof.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    panelRoof.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;    
    panel.addControl(panelRoof);

    let checkboxRoof = new GUI.Checkbox();
    checkboxRoof.width = "20px";
    checkboxRoof.height = "20px";
    checkboxRoof.isChecked = true;
    checkboxRoof.color = "green";
    checkboxRoof.onIsCheckedChangedObservable.add((value) =>{
        if (value) {
          checkboxRoof.color = "green";
          this.roof.isVisible = true;
          this.plafon.isVisible = true;
          this.backWall2.isVisible = true;
            }
        else {
          checkboxRoof.color = "red";
          this.roof.isVisible = false;
          this.plafon.isVisible = false;
          this.backWall2.isVisible = false;
        }
      });
    panelRoof.addControl(checkboxRoof);

    let textRoof = new GUI.TextBlock();
    textRoof.text = "Krov";
    textRoof.width = "180px";
    textRoof.paddingLeft = "10px";
    textRoof.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    textRoof.color = "white";
    panelRoof.addControl(textRoof); 
    

    //left side
    let leftHouseSide = new GUI.StackPanel();
    leftHouseSide.width = "150px";
    leftHouseSide.height = "25px";
    leftHouseSide.isVertical = false;
    leftHouseSide.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    leftHouseSide.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;    
    panel.addControl(leftHouseSide);

    let leftHouseCheckbox = new GUI.Checkbox();
    leftHouseCheckbox.width = "20px";
    leftHouseCheckbox.height = "20px";
    leftHouseCheckbox.isChecked = true;
    leftHouseCheckbox.color = "green";
    leftHouseCheckbox.onIsCheckedChangedObservable.add((value) =>{
      if (value) {
        leftHouseCheckbox.color = "green";
        this.leftSideWall.isVisible = true;
      }
      else {
        this.leftSideWall.isVisible = false;
      }
    });
    leftHouseSide.addControl(leftHouseCheckbox);    
    
    let leftSide = new GUI.TextBlock();
    leftSide.text = "Leva strana";
    leftSide.width = "180px";
    leftSide.paddingLeft = "10px";
    leftSide.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    leftSide.color = "white";
    leftHouseSide.addControl(leftSide); 
 

    let frontHouseSide = new GUI.StackPanel();
    frontHouseSide.width = "150px";
    frontHouseSide.height = "25px";
    frontHouseSide.isVertical = false;
    frontHouseSide.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    frontHouseSide.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;    
    panel.addControl(frontHouseSide);

    let frontHouseCheckbox = new GUI.Checkbox();
    frontHouseCheckbox.width = "20px";
    frontHouseCheckbox.height = "20px";
    frontHouseCheckbox.isChecked = true;
    frontHouseCheckbox.color = "green";
    frontHouseCheckbox.onIsCheckedChangedObservable.add((value) =>{
      if (value) {
        frontHouseCheckbox.color = "green";
        this.frontWall.isVisible = true;
      }
      else {
        this.frontWall.isVisible = false;
      }
    });
    frontHouseSide.addControl(frontHouseCheckbox);    
    
    let frontSide = new GUI.TextBlock();
    frontSide.text = "Frontalna strana";
    frontSide.width = "180px";
    frontSide.paddingLeft = "10px";
    frontSide.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    frontSide.color = "white";
    frontHouseSide.addControl(frontSide); 
 

  }

    



}
