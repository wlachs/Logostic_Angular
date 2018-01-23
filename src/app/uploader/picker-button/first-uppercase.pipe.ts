import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstUppercase'
})
export class FirstUppercasePipe implements PipeTransform {

  transform(value: any, args?: any): any {

    let valueString = value as string;
    var result: string = "";

    for (var i: number = 0; i < valueString.length; i++) {
      result += i === 0 ? valueString[i].toUpperCase() : valueString[i].toLowerCase();
    }

    return result;
  }

}
