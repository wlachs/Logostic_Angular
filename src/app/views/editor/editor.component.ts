import { Component, OnInit } from '@angular/core';
import * as Konva from 'konva';
import { Router } from '@angular/router';
import { ImageService } from '../../services/image-service/image.service';
import * as EXIF from 'exif-js';
import { SessionService } from '../../services/session-service/session.service';

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

  constructor(
    private router: Router,
    private imageService: ImageService,
    private sessionService: SessionService
  ) { }

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
    this.loadBg()
      .then( () => this.loadLogo() )
      .then( () => this.canvas.draw() );

    window.onresize = () => {
      this.canvas.setWidth(document.getElementById('image').clientWidth);
      this.loadBg()
        .then( () => this.loadLogo() )
        .then( () => this.canvas.draw() );
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
  loadBg() {
    return new Promise(( resolve, reject ) => {
      let imageObj1 = new Image();
      imageObj1.src = sessionStorage.getItem('image');
  
      imageObj1.onload = () => this.fixOrientation(imageObj1)
        .then( (rotation: number ) => {
          this.backgroundImage.image(imageObj1);
  
          // Rotation correction
          let width, height;
          this.backgroundImage.offset({x: imageObj1.width / 2, y: imageObj1.height / 2});

          if (rotation === 0 || rotation === 180) {
            width = imageObj1.width;
            height = imageObj1.height;
          } else {
            width = imageObj1.height;
            height = imageObj1.width;
          }

          this.backgroundImage.position({x: width / 2, y: height / 2});
          this.backgroundImage.rotation(rotation);
    
          // add the shape to the layer
          this.backgroundLayer.clear();
          this.backgroundLayer.add(this.backgroundImage);
    
          // add the layer to the stage
          this.canvas.clear();
          this.canvas.add(this.backgroundLayer);
    
          //everything must fit on screen
          let maxPossibleHeight = this.getMaxHeightAvailable();
    
          let scaling = this.canvas.width() / width;
    
          scaling = height * scaling > maxPossibleHeight ? maxPossibleHeight / height : scaling;
    
          this.canvas.scale({
            x: scaling,
            y: scaling
          });
          this.canvas.setWidth(width * scaling);
          this.canvas.setHeight(height * scaling);
    
          // Set container width
          var imageContainer = document.getElementById('image_container');
          imageContainer.setAttribute('style', `width: ${width * scaling}px`);
            
          this.applyBackgroundConstraint();
          resolve();
        });
    });
  }

  /**
   * Fix iPhone image rotation bug
   * @param imageHTML Source image
   */
  fixOrientation(imageHTML: HTMLImageElement) {
    return new Promise( (resolve, reject) => {
      EXIF.getData(imageHTML, function() {
        var allMetaData = EXIF.getAllTags(this);

        switch (allMetaData.Orientation) {
          case 1: resolve(0); break;
          case 8: resolve(-90); break;
          case 3: resolve(180); break;
          case 6: resolve(90); break;
          default: resolve(0); break;
        }
      });
    });
  }

  /**
   * Logo load function
   */
  loadLogo() {
    return new Promise(( resolve, reject ) => {
      let imageObj2 = new Image();
  
      imageObj2.src = sessionStorage.getItem('logo');
      imageObj2.onload = () => this.fixOrientation(imageObj2)
        .then( (rotation: number ) => {
          this.logoImage.image(imageObj2);

          // Rotation correction
          let width, height;
          this.logoImage.offset({x: imageObj2.width / 2, y: imageObj2.height / 2});
          this.logoImage.rotation(rotation);
          
          if (rotation === 0 || rotation === 180) {
            width = imageObj2.width;
            height = imageObj2.height;
          } else {
            width = imageObj2.height;
            height = imageObj2.width;
          }
    
          // add the shape to the layer
          this.logoLayer.clear();
          this.logoLayer.add(this.logoImage);
    
          // add the layer to the stage
          this.canvas.add(this.logoLayer);
    
          // Scaling
          let scaling = this.canvas.width() / width / this.canvas.scaleX();
          scaling =
            scaling * height > this.canvas.height() / this.canvas.scaleY() ?
              this.canvas.height() / height / this.canvas.scaleY() :
              scaling;
            
          scaling /= 5;

          this.logoLayer.scale({
            x: scaling,
            y: scaling
          });

          // Logo initial position
          this.logoLayer.position({x: width * scaling * this.logoScale / 2, y: height * scaling * this.logoScale / 2});
    
          this.applyLogoConstraint();
          resolve();
        });
    });
  } 

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

    let positions = {
      x: (this.canvas.width() / this.canvas.scaleX()) / 2,
      y: (this.canvas.height() / this.canvas.scaleY()) / 2
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
    let hdImage = this.imageService.format(this.canvas.clone() as Konva.Stage, this.backgroundImage);
    this.sessionService.storeExportableImage(hdImage);
    this.router.navigate(['/save']);

    /*
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
    */
  }

  backToUpload() {
    sessionStorage.clear();
    this.router.navigate(['/uploader']);
  }
}
