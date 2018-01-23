import { Component, OnInit } from '@angular/core';
import * as Konva from 'konva';
import { HDFormatter } from './hdformatter';
import { Router } from '@angular/router';

/**
 * Editor view
 */

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  canvas: Konva.Stage;
  backgroundLayer: Konva.Layer;
  logoLayer: Konva.Layer;
  backgroundImage: Konva.Image;
  logoImage: Konva.Image;
  advancedSettingsVisible: Boolean = false;
  backgroundScale: number = 1;
  logoScale: number = 1;
  verticalCenter: Boolean = false;
  horizontalCenter: Boolean = false;

  constructor(private router: Router) { }

  /**
   * On component load
   */
  ngOnInit() {
    this.canvas = new Konva.Stage({
      container: 'image_container',
      width: document.getElementById('image_container').clientWidth,
      height: 0
    });

    this.backgroundLayer = new Konva.Layer({
      draggable: true
    });
    this.logoLayer = new Konva.Layer({
      draggable: true
    });

    this.backgroundImage = new Konva.Image({
      x: 0,
      y: 0,
      image: undefined
    });

    this.logoImage = new Konva.Image({
      x: 0,
      y: 0,
      image: undefined
    });

    // Load bg and logo
    new Promise(this.loadBg).then(() => {
      new Promise(this.loadLogo).then(() => {
        this.canvas.draw();
      });
    });

    window.onresize = () => {
      //TODO modify stage on resize
      //this.canvas.setWidth(document.getElementById('image').clientWidth);
    };
  }

  /**
   * Get max height of screen
   */
  getMaxHeightAvailable(): number {
    return window.innerHeight - document.getElementsByClassName('align-items-center')[0].clientHeight;
  }

  /**
   * Trigger bg resize
   */
  resizeBg() {
    this.backgroundLayer.scale({x: this.backgroundScale, y: this.backgroundScale});
    this.applyBackgroundConstraint();
    this.backgroundLayer.draw();
  }

  /**
   * Trigger logo resize
   */
  resizeLogo() {
    this.logoImage.scale({x: this.logoScale, y: this.logoScale});
    this.applyLogoConstraint();
    this.logoLayer.draw();
  }

  /**
   * BG load function
   */
  loadBg: any = resolve => {
    let imageObj1 = new Image();
    //imageObj1.src = '../../assets/bg.png';
    imageObj1.src = sessionStorage.getItem('image');

    imageObj1.onload = () => {
      this.backgroundImage.image(imageObj1);

      // add the shape to the layer
      this.backgroundLayer.add(this.backgroundImage);

      // add the layer to the stage
      this.canvas.add(this.backgroundLayer);

      //everything must fit on screen
      let maxPossibleHeight = this.getMaxHeightAvailable();

      let scaling = this.canvas.width() / imageObj1.width;

      scaling = imageObj1.height * scaling > maxPossibleHeight ? maxPossibleHeight / imageObj1.height : scaling;

      this.canvas.scale({
        x: scaling,
        y: scaling
      });
      this.canvas.setWidth(imageObj1.width * scaling);
      this.canvas.setHeight(imageObj1.height * scaling);

      
      var imageContainer = document.getElementById('image_container');
      imageContainer.setAttribute('style', `width: ${imageObj1.width * scaling}px`);
      
      this.applyBackgroundConstraint();
      resolve();
    };
  };

  /**
   * Logo load function
   */
  loadLogo: any = resolve => {
    let imageObj2 = new Image();
    //TODO: switch to the image given by user
    //imageObj2.src = '../../assets/Fahrschule Leis Marl Logo.png';
    imageObj2.src = sessionStorage.getItem('logo');

    imageObj2.onload = () => {
      this.logoImage.image(imageObj2);

      // add the shape to the layer
      this.logoLayer.add(this.logoImage);

      // add the layer to the stage
      this.canvas.add(this.logoLayer);

      // Scaling: the longer side of the logo has to be 5th the size of the shorter image side
      let longerLogoSide = imageObj2.width > imageObj2.height ? imageObj2.width : imageObj2.height;
      let shorterImageSide = this.backgroundImage.getWidth() < this.backgroundImage.getHeight() ? this.backgroundImage.getWidth() : this.backgroundImage.getHeight();
      let scaling = shorterImageSide / longerLogoSide / 5;

      this.logoLayer.scale({
        x: scaling,
        y: scaling
      });

      this.applyLogoConstraint();
      resolve();
    };
  };

  /**
   * Keep background between canvas bounds
   */
  applyBackgroundConstraint() {
    this.backgroundLayer.off('dragmove');

    let bgWidth = this.backgroundLayer.width() * this.backgroundLayer.scaleX();
    let bgHeight = this.backgroundLayer.height() * this.backgroundLayer.scaleY();

    let validate = () => {
      var x = this.backgroundLayer.x();
      var y = this.backgroundLayer.y();

      if(x > 0) {
        x = 0;
      } 
      
      else if(x * this.canvas.scaleX() + bgWidth < this.canvas.width()) {
        x = (this.canvas.width() - bgWidth) / this.canvas.scaleX();
      }

      if(y > 0) {
        y = 0;
      } 
      
      else if(y * this.canvas.scaleY() + bgHeight < this.canvas.height()) {
        y = (this.canvas.height() - bgHeight) / this.canvas.scaleY();
      }

      this.backgroundLayer.position({x: x, y: y});
    };

    validate();
    this.backgroundLayer.on('dragmove', validate);
  }

  /**
   * Keep logo between canvas bounds
   * Keep logo centered if needed
   */
  applyLogoConstraint() {
    let logo = this.logoLayer.getChildren((node: Konva.Node) => {
      return node.getClassName() === 'Image';
    })[0] as Konva.Image;

    let logoDimensions = {
      width: logo.width() * this.logoLayer.scaleX() * this.logoImage.scaleX(),
      height: logo.height() * this.logoLayer.scaleY() * this.logoImage.scaleY()
    };

    let positions = {
      x: (this.canvas.width() / this.canvas.scaleX() - logoDimensions.width) / 2,
      y: (this.canvas.height() / this.canvas.scaleY() - logoDimensions.height) / 2
    };

    this.logoLayer.off('dragmove');

    if (this.horizontalCenter) {
      this.logoLayer.position({
        x: positions.x,
        y: this.logoLayer.getPosition().y
      });

      this.logoLayer.on('dragmove', () => {
        this.logoLayer.position({
          x: positions.x,
          y: this.logoLayer.getPosition().y
        });
      });
    }

    if (this.verticalCenter) {
      this.logoLayer.position({
        x: this.logoLayer.getPosition().x,
        y: positions.y
      });

      this.logoLayer.on('dragmove', () => {
        this.logoLayer.position({
          x: this.logoLayer.getPosition().x,
          y: positions.y
        });
      });
    }

    let validate = () => {
      var x = this.logoLayer.x();
      var y = this.logoLayer.y();

      if(x < 0) {
        x = 0
      }

      else if(x + logoDimensions.width > this.canvas.width() / this.canvas.scaleX()) {
        x = this.canvas.width() / this.canvas.scaleX() - logoDimensions.width;
      }

      if(y < 0) {
        y = 0
      }

      else if(y + logoDimensions.height > this.canvas.height()/ this.canvas.scaleY()) {
        y = this.canvas.height() / this.canvas.scaleY() - logoDimensions.height;
      }
      /*
      this.logoLayer.position({
        x: x,
        y: y
      });
      */
    };

    validate();
    this.logoLayer.on('dragmove', validate);

    this.logoLayer.draw();
  }

  /**
   * Reset bg to original position
   */
  bgCenter() {
    this.backgroundLayer.position({
      x: 0,
      y: 0
    });

    this.backgroundScale = 1;
    this.resizeBg();

    this.backgroundLayer.draw();
  }

  /**
   * Export canvas as a JPG
   */
  save() {
    let hdImage = HDFormatter.format(this.canvas.clone() as Konva.Stage, this.backgroundImage);

    // function from https://stackoverflow.com/a/15832662/512042
    let downloadURI = (uri, name) => {
      let date = new Date();
      var link = document.createElement("a");
      link.download = `${name}_${date.getHours()}T${date.getMinutes()}.jpg`;
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    downloadURI(hdImage, 'image');
  }

  backToUpload() {
    sessionStorage.clear();
    this.router.navigate(['/uploader']);
  }
}
