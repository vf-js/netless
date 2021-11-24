import { Main } from '.';

interface ItemData {
    'size': number[];
    'bg': {
        'value': string;
        'x': number;
        'y': number;
    };
    'title': {
        'value': string;
        'x': number;
        'y': number;
    };
    'icon': {
        'value': string;
        'x': number;
        'y': number;
    };
    'start': {
        'value': string;
        'x': number;
        'y': number;
    };
}
export class LevelItem extends vf.gui.Container {

    private size = [1, 1];
    private title!: vf.gui.Label;
    private bg!: vf.gui.Image;
    private icon!: vf.gui.Image;

    private _selected = false;

    public get selected(): boolean {
        return this._selected;
    }

    private _value = '';
    public get value(): string {
        return this._value;
    }

    constructor() {
        super();
        this.initUI();
    }

    private initUI(): void {
        const title = this.title = new vf.gui.Label();

        title.text = 'Level';
        title.y = 10;
        title.style.width = 130;
        title.style.fontSize = 24;
        title.style.fillColor = [0, 0, 0];

        const bg = this.bg = new vf.gui.Image();

        bg.x = this.bg.y = 0;

        const icon = this.icon = new vf.gui.Image();

        this.addChild(bg);
        this.addChild(title);
        this.addChild(icon);

        this.alpha = 1;
        this.interactabled = true;
        this.style.cursor = 'pointer';
        this.on(vf.gui.Interaction.TouchMouseEvent.onHover, this.onHover, this);
        this.on(vf.gui.Interaction.TouchMouseEvent.onPress, this.onPress, this);
    }

    public analysis(data: ItemData): void {
        const { bg, title, icon } = this;

        this._value = data.title.value;
        this.size = data.size;

        bg.src = Main.Ins.loader.resources[data.bg.value].texture;
        bg.scaleX = bg.scaleY = 0.8;

        title.text = data.title.value;
        if (data.title.x) {
            title.x = data.title.x;
        }
        if (data.title.y) {
            title.y = data.title.y;
        }

        if (data.icon.value.charAt(0) === '<') {
            const svg = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1">${data.icon.value}</svg>`;

            this.icon.src = svg;
        }
        else {
            icon.src = vf.Texture.from(data.icon.value);
        }

        if (data.icon.x) {
            icon.x = data.icon.x;
        }
        if (data.icon.y) {
            icon.y = data.icon.y;
        }
    }

    private onHover(e: vf.gui.Interaction.InteractionEvent, button: vf.gui.Button, over: boolean): void {
        if (over) {
            this.alpha = 1;
        }
        else {
            this.alpha = 0.7;
        }
    }

    private onPress(e: vf.gui.Interaction.InteractionEvent, button: vf.gui.Button, press: boolean): void {
        if (press) {
            this.alpha = 0.7;
        }
        else {
            this.alpha = 1;
        }
        this.emit(vf.gui.Interaction.ComponentEvent.COMPLETE, this);
    }

    public get width(): number {
        return this.size[0];
    }

    public get height(): number {
        return this.size[1];
    }
}

