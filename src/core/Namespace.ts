/**
 * @author yangxiao (ifyx@qq.com)
 */
class $Namespace {
    public readonly name: string = '';
    private mapClass = new Map<string, any>();

    constructor(name: string) {
        this.name = name;
    }

    register(key: string, value: any): any {

        if (this.mapClass.has(key)) {
            // eslint-disable-next-line no-throw-literal
            throw '命名空间已存在';
        }
        this.mapClass.set(key, value);

        return value;
    }

    get(key: string): any {
        return this.mapClass.get(key);
    }
}

export const Namespace = new $Namespace('Namespace');
