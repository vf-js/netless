import { Namespace } from './Namespace';

/**
 * @author yangxiao (ifyx@qq.com)
 */
export const enum StateCode {
    INIT = 'init',
    LOAD = 'load',
    LOADED = 'loaded',
    READY = 'ready',
    DISABLED = 'disabled'
}
/**
 * @author yangxiao (ifyx@qq.com)
 */
export class BaseObject extends vf.utils.EventEmitter {
    private _state = StateCode.INIT;

    public get state(): StateCode {
        return this._state;
    }

    constructor(options: any) {
        super();
        if (options) {
            this.initializeObject({}, options);
        }
    }

    private initializeObject(_baseOptions: any, _config: any) {
        //
    }

    public async load(): Promise<any> {
        this._state = StateCode.LOAD;

        return await this.onLoad();
    }

    private async onLoad(): Promise<any> {
        this._state = StateCode.LOADED;
    }

    public release(): void {
        this.onRelease();
    }

    private onRelease(): void {
        this._state = StateCode.DISABLED;
    }

    // public getMetadata(object: any): any {
    //     //
    //     //return metadata;
    // }
}

Namespace.register('BaseObject', BaseObject);
