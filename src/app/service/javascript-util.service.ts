import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JavascriptUtilService {

  constructor() { }

  public isInt(value: any) {
    var x;
    if (isNaN(value)) {
      return false;
    }
    x = parseFloat(value);
    return (x | 0) === x;
  }

}
