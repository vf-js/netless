import { HomeItem } from './homeItem';
import { Main } from './index';
import { LevelList } from './levelList';

export class HomePage extends vf.gui.Container {
    private main: Main;

    private icons: vf.gui.Container;

    constructor(mainmain: Main) {
        super();
        this.main = mainmain;
        this.icons = new vf.gui.Container();
        this.icons.x = 80;
        this.initUI();
    }

    private initUI(): void {
        const { main } = this;
        const scenes = main.sceneJSON.scenes as any[];
        const language = main.language as any;

        const title = new vf.gui.Label();

        title.text = language.title.value;
        title.style.fontSize = 74;
        title.x = main.sceneWidth - title.container.width >> 1;
        title.y = 60;

        this.addChild(title);
        this.addChild(this.icons);

        scenes.forEach((ele) => {
            const item = new HomeItem();

            this.icons.addChild(item);

            const textue = this.main.loader.resources[ele.value].texture;
            const title = language.scenes[ele.value].value;

            item.setItem(title, textue, ele.value);
            item.on(vf.gui.Interaction.ComponentEvent.CHANGE, this.onItemChange, this);
            item.on(vf.gui.Interaction.ComponentEvent.COMPLETE, this.onItemComplete, this);
        });

        this.updateLayout();
    }

    private updateLayout(): void{
        let lastX = 0;
        const marginLeft = 100;

        this.icons.uiChildren.forEach((value) => {
            const item = value as vf.gui.DisplayObject;

            item.x = lastX;
            item.y = 200;
            lastX = marginLeft + item.x + item.width;
        });
    }

    private onItemChange(): void{
        this.updateLayout();
        this.icons.validateNow();
        this.icons.x = 1280 - this.icons.width >> 1;
    }

    private onItemComplete(item: HomeItem): void{
        console.log(item.value);

        const lv = new LevelList(item.value);

        // eslint-disable-next-line no-unused-expressions
        this.main.app.stage?.addChild(lv);
        this.main.drawBG(235, 251, 251);
        this.visible = false;
    }

}
