import { IApp } from '@vf.js/launcher';
import { HomePage } from './homePage';

export class Main {
    public app: IApp;
    private baseUrl = 'assets/build-a-fraction/';
    private bg = new vf.Graphics();

    public language: any;
    public sceneJSON: any;
    public loader: vf.Loader;
    public readonly sceneWidth: number;
    public readonly sceneHeight: number;

    private static _Ins: Main;
    public static get Ins(): Main {
        return Main._Ins;
    }

    constructor(app: IApp) {
        Main._Ins = this;
        this.app = app;
        this.drawBG(0, 0, 0);
        this.sceneWidth = (app as any).option.width;
        this.sceneHeight = (app as any).option.height;
        this.loader = new vf.Loader();
        this.load();
    }

    public async load(): Promise<void> {
        this.sceneJSON = await vf.utils.readFileSync(`${this.baseUrl}scene.json`, { responseType: 'json' });
        this.language = await vf.utils.readFileSync(`${this.baseUrl}zh_cn.json`, { responseType: 'json' });

        const assets = this.sceneJSON.assets;

        for (const key in assets) {
            this.loader.add(key, this.baseUrl + assets[key].value);
        }

        this.loader.onComplete.add(this.onLoad, this);
        this.loader.onError.add(this.onError, this);
        this.loader.load();
    }

    private onLoad(loader2: vf.Loader, resources: any): void {
        //
        console.log("ok")
        this.app.stage?.addChild(new HomePage(this));
    }

    private onError(error: Error, loader2: vf.Loader): void {
        //
    }

    public drawBG(r: number, g: number, b: number): void {
        if (document && document.body) {
            document.body.style.backgroundColor = `rgb(${r},${g},${b})`;
        }
    }

}
