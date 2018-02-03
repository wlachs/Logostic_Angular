import { Injectable } from '@angular/core';
import * as Konva from 'konva';
import { Ng2PicaService } from 'ng2-pica';

/**
 * Scale the whole image to be the same size as the background
 */

@Injectable()
export class ImageService {

  constructor(private ng2PicaService: Ng2PicaService) { }
  
  /**
  * Upsize and convert canvas elements to image
  * @param canvas 
  */
  format(canvas: Konva.Stage){
    const EXPORT_SIZE = 768;

    const aspectRatio = canvas.width() / canvas.height();
    let exportSize: {width: number, height: number} = {width: 0, height: 0};
    let scaling = {x: canvas.scaleX(), y: canvas.scaleY()};

    if (aspectRatio >= 1) {
      exportSize.width = EXPORT_SIZE;
      exportSize.height = EXPORT_SIZE / aspectRatio;
    }
    else {
      exportSize.width = aspectRatio * EXPORT_SIZE;
      exportSize.height = EXPORT_SIZE;
    }

    scaling.x *= exportSize.width / canvas.width();
    scaling.y *= exportSize.height / canvas.height();

    // Set canvas size to match image size
    canvas.setSize({width: exportSize.width, height: exportSize.height});
    
    // Set scaling
    canvas.scale(scaling);

    // Apply changes
    canvas.draw();

    // Convert canvas to DataURL
    let raw = canvas.toDataURL({
        callback: undefined,
        mimeType: "image/jpeg",
        x: 0,
        y: 0,
        width: canvas.width(),
        height: canvas.height(),
        quality: 1
    });

    return raw;
  }

  /**
   * Resize image to match the size of the window
   * @param image Input file
   */
  resizeImage(image: File) {
    return new Promise( (resolve, reject) => {
      this.ng2PicaService.resize([image], Math.max(window.innerWidth, 800), Math.max(window.innerHeight, 600), true)
        .subscribe( result => resolve(result) );
    });
  }
}
