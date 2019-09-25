import { Component, OnInit } from '@angular/core';
import { BabylonService } from '../../shared/babylon.service';

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
  camera2: any;
  light: BABYLON.HemisphericLight;
  GUIPanel:any;


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

  constructor( private babylonService: BabylonService ) { }

  ngOnInit() {
    this.canvas = document.getElementById("canvas");
    this.createScene();
  }


  createScene() {
    this.engine = new BABYLON.Engine(this.canvas); 
    this.scene = new BABYLON.Scene(this.engine); 
    this.scene.clearColor = new BABYLON.Color4(0, 0, 0.2); 
    this.camera = new BABYLON.ArcRotateCamera("camera", 0, Math.PI/3, 30 , new BABYLON.Vector3(0, 0, 0),  this.scene);   
    this.camera2 = new BABYLON.FreeCamera("camera2", new BABYLON.Vector3(0, 0.3, -0.7), this.scene);
    this.camera.attachControl(this.canvas, true); 
    this.camera2.attachControl(this.canvas, true);
    this.camera2.speed = 0.09;
    this.camera2.minZ = 0.001;
    this.scene.activeCamera = this.camera;
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
    this.addGround();
    this.setSkybox();
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

  addGround(){
    let ground = BABYLON.Mesh.CreateGround("ground1", 40, 40, 2, this.scene);
    ground.rotation.z = -Math.PI; 
    ground.rotation.x = -Math.PI; 
    ground.position.y = -0.8;
    let backgroundMaterial:any = new BABYLON.BackgroundMaterial("backgroundMaterial", this.scene);
    backgroundMaterial.diffuseTexture = new BABYLON.Texture("../../../assets/grass.jpg", this.scene);
    backgroundMaterial.diffuseTexture.uScale = 10.0; //Repeat 5 times on the Vertical Axes
    backgroundMaterial.diffuseTexture.vScale = 10.0; //Repeat 5 times on the Horizontal Axes
    backgroundMaterial.shadowLevel = 0.4;
    ground.material = backgroundMaterial;
  }

  setSkybox() {
    let skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:300.0}, this.scene);
    let skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this.scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("../../../assets/textures/skybox", this.scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;
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

    //stairs
    let mesh1:any = BABYLON.Mesh.CreateBox('stair1',0.5,  this.scene);
    mesh1.material = new BABYLON.StandardMaterial('mesh1', this.scene);
    mesh1.material.diffuseColor = new BABYLON.Color3(0.7, 0.7, 0.7);
    mesh1.position.x = 3;
    mesh1.scaling.x = 6;
    mesh1.position.z = -4;
    mesh1.scaling.z = 2.5;
    mesh1.rotation.y = -Math.PI/2;
    mesh1.position.y = -0.3;

    let mesh2:any= BABYLON.Mesh.CreateBox('stair2',0.5,  this.scene);
    mesh2.material = new BABYLON.StandardMaterial('mesh2', this.scene);
    mesh2.material.diffuseColor = new BABYLON.Color3(0.7, 0.7, 0.7);
    mesh2.position.x = 3;
    mesh2.scaling.x = 8;
    mesh2.position.z = -4;
    mesh2.scaling.z = 4.5;
    mesh2.rotation.y = -Math.PI/2;
    mesh2.position.y = -0.6;

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
    //this.leftSideWall.material.diffuseColor = BABYLON.Color3.Green();
    this.leftSideWall.rotation.y = -Math.PI/2
    this.leftSideWall.rotation.z = Math.PI/2;
    this.leftSideWall.position.z = -9;
    this.leftSideWall.position.y = 2.3;

    this.rightSideWall = BABYLON.MeshBuilder.ExtrudePolygon('rightSide' , {shape: sideValues, depth: 0.30, faceUV: this.faceUV }, this.scene);
    this.rightSideWall.material = new BABYLON.StandardMaterial('matRight', this.scene);
    //this.rightSideWall.material.diffuseColor = BABYLON.Color3.Blue();
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

    let door = [
      new BABYLON.Vector3(5,0,-1),
      new BABYLON.Vector3(5,0,2.4),
      new BABYLON.Vector3(3,0,2.4),
      new BABYLON.Vector3(3,0,-1)
    ]

    this.frontWall = BABYLON.MeshBuilder.ExtrudePolygon('front' , {shape: frontValues, holes: [leftWindow, door, rightWindow, livingRoomWindow] , depth: 0.20, faceUV: this.faceUV }, this.scene);
    this.frontWall.material = new BABYLON.StandardMaterial('matBack', this.scene);
    this.frontWall.material.diffuseColor = BABYLON.Color3.Yellow();
    this.frontWall.rotation.y = Math.PI/2;
    this.frontWall.rotation.x = Math.PI/2;
    this.frontWall.position.x = 2.7;
    this.frontWall.position.y = 2.4;
  }

  changeCameraGUI:any;

  setCameraGUI() {
    this.changeCameraGUI = this.babylonService.createGUIPanel('Promeni kameru');
    this.changeCameraGUI.verticalAlignment = 'VERTICAL_ALIGNMENT_TOP'; 

    let changeCamerPanel = this.babylonService.createStackPanel(150, 25, false, 'HORIZONTAL_ALIGNMENT_LEFT', 'VERTICAL_ALIGNMENT_CENTER' ); 
    changeCamerPanel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;    
    this.changeCameraGUI.addControl(changeCamerPanel);

    let changeCamerPanelCheckbox = this.babylonService.createCheckbox(20, 20, false, 'green');
    changeCamerPanelCheckbox.onIsCheckedChangedObservable.add( value => this.scene.activeCamera = value? this.camera2 :this.camera);
    changeCamerPanel.addControl(changeCamerPanelCheckbox);    
    
    let changeCamerPanelText = this.babylonService.createTextBlock("Free camera", 180, 20, 10,'white');
    changeCamerPanel.addControl(changeCamerPanelText); 
  }


  setGUI(){
    this.setCameraGUI();

    this.GUIPanel = this.babylonService.createGUIPanel('Togluj vidljivost');

    //ROOF
    let panelRoof = this.babylonService.createStackPanel(150, 25, false, 'HORIZONTAL_ALIGNMENT_LEFT', 'VERTICAL_ALIGNMENT_CENTER' );   
    this.GUIPanel.addControl(panelRoof);

    let checkboxRoof = this.babylonService.createCheckbox(20, 20, true,'green' );
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

    let textRoofText = this.babylonService.createTextBlock("Krov",180, 20, 10,'white');
    panelRoof.addControl(textRoofText); 


    //LEFT SIDE
    let leftHouseSide = this.babylonService.createStackPanel(150, 25, false, 'HORIZONTAL_ALIGNMENT_LEFT', 'VERTICAL_ALIGNMENT_CENTER' );  
    this.GUIPanel.addControl(leftHouseSide);
    
    let leftHouseCheckbox = this.babylonService.createCheckbox(20, 20, true, 'green');
    leftHouseCheckbox.onIsCheckedChangedObservable.add(( value => this.leftSideWall.isVisible = value? true: false));
    leftHouseSide.addControl(leftHouseCheckbox);    
    
    let leftSideText = this.babylonService.createTextBlock("Leva strana",180, 20, 10,'white');
    leftHouseSide.addControl(leftSideText); 
    

    // FRONT
    let frontHouseSide = this.babylonService.createStackPanel(150, 25, false, 'HORIZONTAL_ALIGNMENT_LEFT', 'VERTICAL_ALIGNMENT_CENTER' ); 
    frontHouseSide.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;    
    this.GUIPanel.addControl(frontHouseSide);

    let frontHouseCheckbox = this.babylonService.createCheckbox(20, 20, true, 'green');
    frontHouseCheckbox.onIsCheckedChangedObservable.add(( value => {this.frontWall.isVisible = value? true: false}));
    frontHouseSide.addControl(frontHouseCheckbox);    
    
    let frontSideText = this.babylonService.createTextBlock("Frontalna strana",180, 20, 10,'white');
    frontHouseSide.addControl(frontSideText); 
 

  }

    



}
