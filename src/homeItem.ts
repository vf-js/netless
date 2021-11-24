export class HomeItem extends vf.gui.Container {
    private title: vf.gui.Label;
    private sprite: vf.Sprite;
    private rect: vf.gui.Rect;
    private defaultScale = 0.5;
    private static lastSelectItem?: HomeItem;

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
        this.title = new vf.gui.Label();
        this.title.style.fontSize = 54;
        this.sprite = new vf.Sprite();
        this.rect = new vf.gui.Rect();
        this.rect.x = this.rect.y = -10;
        this.rect.radius = 10;
        this.rect.style.lineColor = [255, 206, 27];
        this.rect.style.lineWidth = 10;
        this.container.addChild(this.sprite);
        this.addChild(this.title);
        this.alpha = 0.7;
        this.scaleX = this.scaleY = this.defaultScale;
        this.interactabled = true;
        this.style.cursor = 'pointer';
        this.on(vf.gui.Interaction.TouchMouseEvent.onHover, this.onHover, this);
        this.on(vf.gui.Interaction.TouchMouseEvent.onClick, this.onClick, this);
    }

    public setItem(text: string, texture: vf.Texture, v: string): void {
        const { sprite, title } = this;

        this._value = v;
        sprite.texture = texture;
        title.text = text;
        title.x = sprite.width - title.width >> 1;
        title.y = sprite.height + 20;
    }

    private onHover(e: vf.gui.Interaction.InteractionEvent, button: vf.gui.Button, over: boolean): void {
        const lastItem = HomeItem.lastSelectItem;

        if (lastItem === this) {
            return;
        }

        if (over) {
            this.alpha = 1;
        }
        else {
            this.alpha = 0.7;
        }
    }

    private onClick(): void {
        const lastItem = HomeItem.lastSelectItem;

        if (lastItem === this) {
            this.emit(vf.gui.Interaction.ComponentEvent.COMPLETE, this);

            return;
        }

        if (lastItem) {
            lastItem.draw(false);
        }

        HomeItem.lastSelectItem = this;

        this.draw(true);
        this.emit(vf.gui.Interaction.ComponentEvent.CHANGE, this);
    }

    public get width(): number {
        return this.container.width;
    }

    public get height(): number {
        return this.container.height;
    }

    public draw(select: boolean): void {
        const { rect } = this;

        if (select) {
            const scaleOffset = 0.1;

            this.alpha = 1;
            this.scaleX = this.scaleY = this.defaultScale + scaleOffset;
            rect.width = this.sprite.width + 20;
            rect.height = this.sprite.height + 20;
            this.addChild(this.rect);
        }
        else {
            this.alpha = 0.7;
            this.scaleX = this.scaleY = this.defaultScale;
            this.removeChild(this.rect);
        }

        this._selected = select;
    }
}

