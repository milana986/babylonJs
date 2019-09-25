import { Injectable } from '@angular/core';

import * as GUI from 'babylonjs-gui';

@Injectable({
  providedIn: 'root'
})
export class BabylonService {

  constructor() { }

  createGUIPanel(type?) {
    let myGUI = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    let panel = this.createStackPanel(210, 200, true, 'HORIZONTAL_ALIGNMENT_LEFT', 'VERTICAL_ALIGNMENT_CENTER' );
    panel.paddingLeft = "10px";  
    myGUI.addControl(panel);

    let panelHeading = this.createStackPanel(150, 45, false, 'HORIZONTAL_ALIGNMENT_LEFT', 'VERTICAL_ALIGNMENT_CENTER' );
    panel.addControl(panelHeading);

    let headingText = this.createTextBlock(type,180, 40, 10, 'white' );
    headingText.paddingBottom = "15px";
    panelHeading.addControl(headingText); 
    
    return panel;
  }

  createStackPanel(width?, height?, isVertical?, horizontalAlignment?, verticalAlignment?) {
    let stackPanel = new GUI.StackPanel();
    stackPanel.width = `${width}px`;
    stackPanel.height = `${height}px`;
    stackPanel.isVertical = isVertical;
    stackPanel.horizontalAlignment = GUI.Control[horizontalAlignment];
    stackPanel.verticalAlignment = GUI.Control[verticalAlignment];

    return stackPanel;
  }

  createTextBlock(side?, width?, height?,  paddingLeft?, color?, aligment?,) {
    let textBlock = new GUI.TextBlock();
    textBlock.text = side;
    textBlock.width = `${width}px`;
    textBlock.paddingLeft = `${paddingLeft}px`;
    textBlock.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    textBlock.color = color;

    return textBlock;
  }

  createCheckbox(width, height, isChecked, color) {
    let checkbox = new GUI.Checkbox();
    checkbox.width = `${width}px`;
    checkbox.height = `${height}px`;
    checkbox.isChecked = isChecked;
    checkbox.color = color;
  
    return checkbox;
  }


}
