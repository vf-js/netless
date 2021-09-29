export const enum SyncType {
    'live' = 'live',
    'history' = 'history',
}

export const enum StateType {
    INIT = 'init',
    LOAD = 'load',
    LOADED = 'loaded',
    READY = 'ready',
}

export const platform = {
    from: 'netless',
    role: 1,
    roomid: '1',
    userid: 1,
};

/**
 * 注册事件类型
 */
export function register(type: string): void{
    parent.postMessage({
        kind: 'RegisterMagixEvent',
        payload: type,
    }, '*');
}

export function dispatch(payload: any, event = 'syncEvent'): void{
    parent.postMessage({
        kind: 'DispatchMagixEvent',
        payload: {
            event,
            payload,
        },
    }, '*');
}

/**
 * 设置课件总页数，初始化前完成
 * @param value 值
 */
export function setPage(value: number): void{
    parent.postMessage({
        kind: 'SetPage',
        payload: value,
    }, '*');
}

/**
 * 跳转指定页面
 * @param value 值
 */
export function pageTo(value: number): void{
    parent.postMessage({ kind: 'PageTo', payload: value + 1 }, '*');
}

/**
 * 设置需要保存的属性列表
 * @param payload  值
 */
export function setAttributes(payload: any): void{
    parent.postMessage({ kind: 'SetAttributes', payload }, '*');
}

/**
 * 获取URL参数
 * @param variable .
 * @returns .
 */
export function getQueryVariable(variable: string): string | undefined {
    const query = window.location.search.substring(1);
    const vars = query.split('&');

    for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split('=');

        if (pair[0] === variable) {
            return pair[1];
        }
    }

    return undefined;
}
