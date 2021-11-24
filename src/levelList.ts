/* eslint-disable @typescript-eslint/no-use-before-define */
import { Main } from '.';
import { LevelItem } from './levelItem';

export class LevelList extends vf.gui.Container {

    private icons: vf.gui.Container;
    private icons1: vf.gui.Container;
    private icons2: vf.gui.Container;

    private leftPageBtn!: vf.gui.Button;
    private rightPageBtn!: vf.gui.Button;
    private up = SVGResource.getPageBtnUp();
    private down = SVGResource.getPageBtnDown();

    private sceneValue: string;

    constructor(sceneValue: string) {
        super();
        this.sceneValue = sceneValue;

        const mask = new vf.gui.Rect();

        mask.color = 0xffffff;

        this.icons = new vf.gui.Container();
        this.icons.x = 250;
        this.icons.y = 140;
        this.icons.style.maskImage = mask;
        this.icons.style.maskSize = [780, 500];
        this.icons1 = new vf.gui.Container();
        this.icons2 = new vf.gui.Container();
        this.icons2.y = 260;
        this.icons.addChild(this.icons1);
        this.icons.addChild(this.icons2);
        this.addChild(this.icons);
        this.initUI();
    }

    private initUI(): void {
        const main = Main.Ins;

        const scenes = main.sceneJSON.scenes as any[];
        const language = main.language as any;

        const title = new vf.gui.Label();
        const leftPageBtn = this.leftPageBtn = new vf.gui.Button();
        const rightPageBtn = this.rightPageBtn = new vf.gui.Button();

        this.addChild(title);
        this.addChild(leftPageBtn);
        this.addChild(rightPageBtn);

        title.text = language.chooseYourLevel.value;
        title.style.fontSize = 44;
        title.style.fillColor = [0, 0, 0];
        title.x = main.sceneWidth - title.container.width >> 1;
        title.y = 60;

        leftPageBtn.width = 50;
        leftPageBtn.height = 45;
        leftPageBtn.x = 610;
        leftPageBtn.y = main.sceneHeight - 70;
        leftPageBtn.scaleX = -1;
        leftPageBtn.up = this.up;
        leftPageBtn.down = this.down;
        leftPageBtn.move = this.down;
        leftPageBtn.upAndSelected = this.down;
        leftPageBtn.on('click', this.onPageBtn, this);
        leftPageBtn.setSelected(true);

        rightPageBtn.width = 50;
        rightPageBtn.height = 45;
        rightPageBtn.x = 650;
        rightPageBtn.y = main.sceneHeight - 70;
        rightPageBtn.up = this.up;
        rightPageBtn.down = this.down;
        rightPageBtn.move = this.down;
        rightPageBtn.upAndSelected = this.down;
        rightPageBtn.on('click', this.onPageBtn, this);

        const rowContainer = [this.icons1, this.icons2];

        scenes.forEach((ele) => {
            if (ele.value === this.sceneValue) {
                (ele.rows as any[]).forEach((columns: any[], index: number) => {
                    columns.forEach((data: any) => {
                        const item = new LevelItem();

                        item.analysis(data);
                        item.on(vf.gui.Interaction.ComponentEvent.CHANGE, this.onItemChange, this);
                        item.on(vf.gui.Interaction.ComponentEvent.COMPLETE, this.onItemComplete, this);
                        rowContainer[index].addChild(item);
                    });
                });
            }
        });

        this.updateLayout(this.icons1);
        this.updateLayout(this.icons2);
    }

    private updateLayout(c: vf.gui.Container): void {
        let lastW = 0;
        let lastX = 0;
        const marginLeft = 50;

        c.uiChildren.forEach((value) => {
            const item = value as vf.gui.DisplayObject;

            item.x = lastX;
            lastX = marginLeft + item.x + item.width;
            lastW += item.width + marginLeft;
        });

        //c.x = 1280 - lastW >> 1;
    }

    private onItemChange(): void {
        // this.updateLayout();
        // this.icons.validateNow();
        // this.icons.x = 1280 - this.icons.width >> 1;
    }

    private onItemComplete(item: LevelItem): void {
        console.log(item.value);
    }

    private lastTweenUpdate = 0;

    private onPageBtn(e: any, button: vf.gui.Button): void {
        const data = { from: 0, to: 0 };

        if (button === this.leftPageBtn) {
            if (this.lastTweenUpdate === 0) {
                return;
            }
            data.from = -800;
            data.to = 0;
            this.leftPageBtn.setSelected(true);
            this.rightPageBtn.setSelected(false);
        }
        else {
            if (this.lastTweenUpdate !== 0) {
                return;
            }
            data.from = 0;
            data.to = -800;
            this.leftPageBtn.setSelected(false);
            this.rightPageBtn.setSelected(true);
        }
        vf.gui.Tween.from({ x: data.from }, { x: data.to }, 100)
            .on(vf.gui.Tween.Event.update, this.onTweenUpdate, this)
            .on(vf.gui.Tween.Event.complete, this.onTweenComplete, this)
            .start();
        this.leftPageBtn.interactive = false;
        this.rightPageBtn.interactive = false;
    }

    private onTweenUpdate(data: any): void {
        this.icons1.x = data.x;
        this.icons2.x = data.x;
        this.lastTweenUpdate = data.x;
        console.log(data.x);
    }

    private onTweenComplete(data: any): void {
        this.leftPageBtn.interactive = true;
        this.rightPageBtn.interactive = true;
        console.log("onTweenComplete", data.x);
    }
}

class SVGResource {
    static PAGEBTN = `<svg  width="50" height="45" xmlns="http://www.w3.org/2000/svg" version="1.1">
        <g transform="translate(20,20.25000000000000000000)">
            <g>
                <circle r="20" style="fill:rgb(#rgbrgb); stroke: none;stroke-width: 0.5;stroke-miterlimit: 10;">
                </circle>
                <g>
                    <circle r="20"
                        style="fill: rgb(#rgbrgb); stroke: rgb(153,152,50);stroke-width: 0.5;stroke-miterlimit: 10;">
                    </circle>
                </g>
            </g>
            <g>
                <g
                    transform="matrix(1.16799999999999992717,0.00000000000000000000,0.00000000000000000000,1.16799999999999992717,-0.25498484809834986997,-0.00000000000000088818)">
                    <g
                        transform="matrix(0.00000000000000006123,1.00000000000000000000,-1.00000000000000000000,0.00000000000000006123,0.00000000000000000000,0.00000000000000000000)">
                        <path
                            d="M -10.00000000000000000000 4.00000000000000000000 L 0.00000000000000000000 -6.00000000000000000000 L 10.00000000000000000000 4.00000000000000000000 "
                            style="fill: none; stroke: black;stroke-width: 5;stroke-linecap: round;stroke-miterlimit: 10;">
                        </path>
                    </g>
                </g>
            </g>
        </g>
    </svg>`;

    static getPageBtnUp(): vf.Texture {
        return vf.Texture.from(SVGResource.PAGEBTN.replace(/#rgbrgb/g, '254,253, 83'), {width:45,height:45});
    }

    static getPageBtnDown(): vf.Texture {
        return vf.Texture.from(SVGResource.PAGEBTN.replace(/#rgbrgb/g, '220,220,220'), {width:45,height:45});
    }
}
