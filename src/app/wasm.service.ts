import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { filter, take, mergeMap } from 'rxjs/operators';

import * as Module from './wasm/factorial.js';
import '!!file-loader?name=wasm/factorial.wasm!./wasm/factorial.wasm';

declare var WebAssembly;

@Injectable({
  providedIn: 'root'
})
export class WasmService {

  module: any;

  wasmReady = new BehaviorSubject<boolean>(false);

  constructor() {
    this.instantiateWasm('wasm/factorial.wasm');
  }

  private async instantiateWasm(url: string) {
    // fetch the wasm file
    const wasmFile = await fetch(url);

    // convert it into a binary array
    const buffer = await wasmFile.arrayBuffer();
    const binary = new Uint8Array(buffer);

    // create module arguments
    // including the wasm-file
    const moduleArgs = {
      wasmBinary: binary,
      onRuntimeInitialized: () => {
        this.wasmReady.next(true);
      }
    };

    // instantiate the module
    this.module = Module(moduleArgs);
  }

  public factorial(input: number): Observable<any> {
    return this.wasmReady.pipe(filter(value => value === true)).pipe(
      mergeMap(() => {
        return fromPromise(
          new Promise<number>((resolve, reject) => {
            setTimeout(() => {
              const result = this.module._factorial(input);
              resolve(result);
            });
          })
        );
      }),
      take(1)
    );
  }
}
