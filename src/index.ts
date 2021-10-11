/* eslint-disable no-unused-expressions */
/* eslint-disable max-len */
import { createVF, IPlayer } from '@vf.js/launcher';
import { dispatch, pageTo, platform, register, setAttributes, setPage, StateType, SyncType, getQueryVariable } from './common';

class Main {
    constructor() {
        this.initEvent();
    }

    private player?: IPlayer;
    private state = StateType.INIT;
    /**
     * 记录信令状态列表
     */
    private attributes: { [key: string]: any } = {};
    /**
     * 当前的页数
     */
    private curPage = 0;
    /**
     * json的URL
     */
    private url = '';
    /**
     * 场景总页数
     */
    private total = 0;
    /**
     * 是否开启调试
     */
    private debug = false;
    /**
     * 是否展示帧率
     */
    private showFPS = false;

    private initEvent(): void {
        this.url = getQueryVariable('url') || '';
        this.debug = Boolean(getQueryVariable('debug')) || false;
        this.total = Number(getQueryVariable('total')) || 100;
        this.showFPS = Boolean(getQueryVariable('showFPS')) || false;
        window.addEventListener('message', this.reciveMsg.bind(this));
        register('syncEvent');
        // 后面可以通过URL参数传入具体总页数，先临时写这里
        setPage(this.total);
    }

    private initVF(): void {
        if (this.state !== StateType.INIT) {
            return;
        }
        this.state = StateType.LOAD;
        createVF({
            container: document.getElementById('vf-container') as any,
            version: '2.0.10',
            usePlayer: true,
            debug: this.debug,
            showFPS: this.showFPS,
            platform,
            vfvars: {
                syncInteractiveFlag: true,
                role: platform.role === 1 ? 'T' : 'S',
                mode: 1, // 模式  1-预览  2-直播   3-回放
            },
        }, (player) => {
            this.state = StateType.LOADED;
            this.player = player as IPlayer;
            const _player = player as IPlayer;

            _player.onError = this.onError.bind(this);
            _player.onMessage = this.onMessage.bind(this);
            _player.onSceneCreate = this.onSceneCreate.bind(this);
            _player.switchToSceneIndex(this.curPage);
            _player.play(this.url);

            this.test();
        });
    }

    private innitRoomStateChanged = true;
    private reciveMsg(msg: any): void {
        const data = msg.data.payload;
        const _player = this.player;

        if (window.self === window.top) {
            this.initVF();

            return;
        }
        switch (msg.data.kind) {
            case 'ReciveMagixEvent':
                if (data.payload.code === 'syncEvent') {
                    this.message(data.payload.data, SyncType.live);
                }
                break;
            case 'AttributesUpdate':
                this.attributes = data.attributes || data;
                break;
            case 'GetAttributes':
                break;
            case 'Init':
                this.curPage = data.attributes.curPage || (data.currentPage - 1);
                this.attributes = data.attributes;
                platform.userid = data.observerId;
                this.initVF();
                break;
            case 'RoomStateChanged':
                if (this.innitRoomStateChanged) {
                    this.innitRoomStateChanged = false;

                    return;
                }
                // eslint-disable-next-line no-case-declarations
                const newIndex = data.sceneState.index;

                if (this.curPage !== newIndex) {
                    this.curPage = newIndex;
                    if (_player) {
                        _player.switchToSceneIndex(newIndex);
                    }
                }
                break;
        }
    }

    private message(msg: any, syncType: SyncType): void {
        const _player = this.player as IPlayer;

        if (this.state === StateType.READY && _player.stage && _player.stage.syncManager) {
            _player.stage.syncManager.receiveEvent(msg, syncType);
        }
    }

    /**
     * player 推送出来的消息，一般需要发送到信令服务器
     * @param msg 消息
     *
     *  这里要考虑数据量的问题，要讨论在退回上页是否需要保留恢复上页状态
     *
     *  如果需要清理处理，可以在每次切换场景时，清理数据
     *
     *  key = 场景index_time_observerId; // 第一期不加observerId
     */
    private onMessage(msg: vf.IEvent): void {
        if (msg.code === 'syncEvent') { // 同步数据
            dispatch(msg);

            const payload = {} as any;
            const key = `${this.curPage}_${Date.now()}`;

            payload[key] = msg.data;
            setAttributes(payload);
        }
    }

    private onSceneCreate(msg: vf.IEvent): void {
        this.state = StateType.READY;
        if (this.curPage !== msg.data.index) {
            pageTo(msg.data.index);
            setAttributes({ curPage: msg.data.index });
        }
        const historyData = {} as any;
        const attributes = this.attributes;
        const sceneIndexStr = msg.data.index.toString();
        const len = sceneIndexStr.length;
        let isHistory = false;

        for (const key in attributes) {
            if (key.substr(0, len) === sceneIndexStr) {
                historyData[attributes[key].code] = attributes[key];
                isHistory = true;
            }
        }

        if (isHistory) {
            this.message(historyData, SyncType.history);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private onError(msg: vf.IEvent): void {
        // console.error(msg);
    }

    private test(): void {
        if (!this.debug) {
            return;
        }
        const _player = this.player;

        const div = document.createElement('div');

        div.style.position = 'absolute';
        div.innerHTML = `
            <button id="button0">上一页</button>
            <button id="button1">下一页</button>
        `;
        document.body.appendChild(div);

        document.getElementById('button0')?.addEventListener('click', () => {
            _player && _player.switchToPrevScene();
        });

        document.getElementById('button1')?.addEventListener('click', () => {
            _player && _player.switchToNextScene();
        });
    }
}

const main = new Main();

export { main };
