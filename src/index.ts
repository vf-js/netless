/* eslint-disable max-len */
import { createVF, IPlayer } from '@vf.js/launcher';

const enum SyncType {
    'live' = 'live',
    'history' = 'history',
}
const platform = {
    from: 'debug',
    role: 1,
    roomid: '1',
    userid: 1,
};

class Main {
    constructor() {
        this.initEvent();
        this.initVF();
    }

    private player?: IPlayer;
    private isScene = false;
    private reciveList: any[] = [];

    private initEvent(): void {
        window.addEventListener('message', this.reciveMsg.bind(this));
        parent.postMessage({
            kind: 'RegisterMagixEvent',
            payload: 'syncEvent', // 注册对要接收事件的监听，同一个事件只会监听一次
        }, '*');
    }

    private initVF(): void {
        createVF({
            container: document.getElementById('vf-container') as any,
            version: '2.0.7',
            usePlayer: true,
            platform,
            vfvars: {
                syncInteractiveFlag: true,
                role: platform.role === 1 ? 'T' : 'S',
                mode: 1, // 模式  1-预览  2-直播   3-回放
            },
        }, (player) => {
            this.player = player as IPlayer;
            const _player = player as IPlayer;

            _player.onError = this.onError.bind(this);
            _player.onMessage = this.onMessage.bind(this);
            _player.onSceneCreate = this.onSceneCreate.bind(this);
            _player.switchToSceneIndex(2);
            _player.play('./demo/editor.json');

            // setTimeout(() => {
            //     (_player as any).switchToSceneIndex(2);
            // }, 3000);
        });
    }

    private reciveMsg(msg: any): void {
        console.log('parent', msg);
        switch (msg.data.kind) {
            case 'Init':
                break;
            case 'ReciveMagixEvent':
            //this.message(msg.data.)
                break;
            case 'AttributesUpdate':

                break;
            case 'GetAttributes':

                break;
            case 'RoomStateChanged':
                // if (o.sceneState) {
                //     var n = o.sceneState;
                //     this.emit(l.StateSyncEvent.PageChange, n)
                // }
                break;
        }
    }

    private message(msg: vf.IEvent): void {
        const _player = this.player as IPlayer;

        if (this.isScene && _player.stage) {
            _player.stage.sendToPlayer(msg);
        }
        else {
            const data = {
                type: SyncType.history,
                data: msg,
            };

            this.reciveList.push(data);
        }
    }

    private onMessage(msg: vf.IEvent): void {
        if (msg.code === 'syncEvent') { // 同步数据
            console.log('我发送了数据');
            parent.postMessage({
                kind: 'DispatchMagixEvent',
                payload: {
                    event: 'syncEvent', // 要发送到事件名称
                    payload: msg, // 事件内容
                },
            }, '*');

            setTimeout(() => {
                parent.postMessage({
                    kind: 'DispatchMagixEvent',
                    payload: {
                        event: 'syncEvent', // 要发送到事件名称
                        payload: {msg:"xxxxx"}, // 事件内容
                    },
                }, '*');
            }, 5000);
        }
    }

    private onSceneCreate(msg: vf.IEvent): void {
        const _player = this.player as IPlayer;

        this.isScene = true;
        if (_player.stage && _player.stage.syncManager) {
            _player.stage.syncManager.sendCustomEvent({
                code: 'customEvent',
                level: 'command',
                data: msg,
            });

            if (this.reciveList.length > 0) {
                const item = {
                    level: 'command',
                    code: 'syncEvent',
                    data: this.reciveList.concat(),
                };

                this.reciveList.length = 0;
                _player.stage.sendToPlayer(item);
            }
        }
    }

    private onError(msg: vf.IEvent): void {
        console.error(msg);
    }
}

new Main();

//       this.player.sendToStage({
//         level: "command",
//         code: "syncEvent",
//         data: eventData,
//       });

//       this.player.sendToStage({
//         level: "command",
//         code: "syncEvent",
//         data: eventData,
//       });

// player.onSceneLoad = function (e) {
//     console.log('onSceneLoad', e); // 资源加载完成
//     const pageIndex = e.data.index;

//     // if(that.lastPageIndex != pageIndex) {
//     //   that.player && that.player.switchToSceneIndex(that.lastPageIndex)
//     // }
//     if ((that.pageNumber - 1) !== pageIndex) {
//         // that.initData()
//         that.$store.commit('setPageIndex', pageIndex);
//         if (that.role != constData.ROLE_VAL.TEACHER) {
//             return;
//         }
//         console.log('xxxx, signal');
//         //  vf有自动翻页不能仅靠slider控制
//         //  vf通过抛出changepage事件去控制vfloder翻页，但仍然要通过信令通知信令去告诉学生端页码变更，恢复历史或者初始加载场景
//         signal.sendSignalData({
//             cmd: 'broadcast_store',
//             action: 'merge',
//             data: {
//                 action: 'turn',
//                 templateType: 'page',
//                 pageIndex,
//                 role: this.role,
//             },
//         }, true);
//     }
// };
// player.onSceneCreate = function (e) {
//     console.log('getStyle', e, document.getElementById('vfApp').getElementsByTagName('canvas')[0].style);
//     const videoList = e.data.videoList;

//     if (videoList && videoList.length) {
//         const newList = [];

//         videoList.forEach((item) => {
//             const newItem = item.toDomRectangle();

//             console.log('newList', item);
//             // return {
//             //   ...item,
//             //   ...newItem
//             // }
//             //  x:left, y:top,
//             const { _src: source, _src: src, _autoplay: autoplay, _audio: audio, _video: dom, fullscreen, id, isPlaying, name, poster, _silent: silent, zIndex } = item;
//             const {
//                 x: left, y: top, width, height,
//             } = newItem;

//             console.log('itemeeee', item);
//             newList.push(
//                 {
//                     left,
//                     top,
//                     source,
//                     autoplay,
//                     audio,
//                     width,
//                     height,
//                     display: 'block',
//                     fullscreen: false,
//                     height: item._lastPostion.height,
//                     id,
//                     isPlaying: false,
//                     name,
//                     poster,
//                     silent,
//                     src,
//                     width: item._lastPostion.width,
//                     zIndex,
//                 },
//             );
//         });
//         console.log('videoList', videoList, videoList[0].audio, videoList[0]._audio, newList);
//         that.$store.commit('setTangramVideo', newList);
//     }
//     else {
//         that.$store.commit('setTangramVideo', null);
//     }

//     that.initCanvasStyle();
//     that.initData();
//     console.log('onSceneCreate', e.data.index, that.pageNumber, that.lastPageIndex); // 资源加载完成
//     const pageIndex = e.data.index;

//     if ((that.pageNumber - 1) !== pageIndex) {
//         // that.initData()
//     }

//     console.log('onSceneCreate', e); // 资源加载完成
// };

// player.onMessage = function (vfData) {
//     console.log('vfData', vfData);
//     if (vfData.code == 'LoadProgress') {
//         // 伪进度
//         if (vfData.data[0] / 100 < 1) {
//             that.loaded = vfData.data[0] / 100;
//         }
//     }
//     if (vfData.code == 'native') {
//         // 播放、暂停声音
//         const data = vfData.data;

//         if (data.type == 'playAudio') {
//             that.playAudio(data.src, data.mode, data.signalling);
//         }
//         else if (data.type == 'pauseAudio') {
//             that.pauseAudio();
//         }
//     }
//     else if (vfData.code == 'syncEvent') {
//         console.log('syncEvent', vfData);
//         that.sendSignalData(vfData.data.code, vfData.data, 300);
//         // 发送同步事件，包括了底层的输入操作事件和自定的同步事件
//     }
//     else if (vfData.code == 'chooseOption') {
//         // KB分支发送答题事件
//         that.chooseOption(
//             vfData.data.totalCount,
//             vfData.data.isRight,
//             vfData.data.isFinish,
//             vfData.data.signalling,
//         );
//     }
//     that.logErr(vfData);
// };

// player.onError = function (evt) {
//     console.log('onError ==>', evt);
//     if (evt && evt.code == 404) {
//         console.log('evt', evt);
//     }
// };

// player.onDispose = function () {
//     console.log('onDispose');
// };
// const json = dataManager.lessonJSON.content;

// console.log('json', json);
// that.player.switchToSceneIndex(that.pageIndex);
// that.player.play(json);

/**
     * 接收信令
     * @param type: 信令类型  history-历史信令   live-实时信令
     * @param data: data
     */
//   postMessage(type, data) {
//     let eventData = { type: type };
//     if (type === "history") {
//       //模板刚加载完成，必然会跑一次history
//       let { historyObj } = data;
//       eventData.data = historyObj;
//     } else if (type === "live") {
//       let { val } = data;
//       eventData.data = val;
//     }
//     console.log('postMessage', type, data)
//     //将信令发送至stage-syncManager统一处理
//     this.player && this.player.sendToStage &&
//       this.player.sendToStage({
//         level: "command",
//         code: "syncEvent",
//         data: eventData,
//       });
//   },

/**
 * restore,slider中点击重置按钮时调用，恢复模板到初始状态
 */
//  restoreVF() {
//     //暂停声音
//     this.pauseAudio();
//     if (this.player) {
//       //重置引擎
//       this.player.stage.syncInteractiveFlag = false;
//       this.player.reset();
//       this.player.stage.syncInteractiveFlag = true;
//     }
//     this.initData();
//   },

// /**
//  * 初始化逻辑变量，没有历史信令，或者restore时调用
//  */
//     initData() {
//     if (this.isTeacher) {
//         let eventData = {
//         level: "command",
//         code: "initData",
//         data: "",
//         };
//         this.player && this.player.message(eventData);
//     }
//     },
