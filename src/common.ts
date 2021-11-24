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
    from: 'oasis',
    role: 1,
    roomid: '1',
    userid: 1,
};

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
