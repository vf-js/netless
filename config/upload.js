/* eslint-disable no-console */
const OSS = require('ali-oss');
const path = require('path');
const common = require('./common');

class Yun {
    client = undefined;

    async $isExistObject(name, options = {}) {
        try {
            await this.client.head(name, options);

            return true;
        }
        catch (error) {
            if (error.code === 'NoSuchKey') {
                return false;
            }
        }

        return false;
    }

    async upload(accessKeyId, accessKeySecret, localPath) {
        if (!accessKeyId || !accessKeySecret) {
            common.errorExit('上传文件失败,缺少accessKeyId或accessKeySecret！');
        }
        this.client = new OSS({
            region: 'oss-cn-beijing',
            accessKeyId,
            accessKeySecret,
            bucket: 'vf-engine',
        });

        if (!this.client) {
            common.errorExit('上传文件失败,未进行初始化操作！');
        }
        try {
            const files = common.getDirFile(localPath, './');

            for (const key in files) {
                const newKey = `/platform/netless/v1/${key}`;
                const bool = await this.$isExistObject(newKey);

                if (!bool) {
                    const r1 = await this.client.put(newKey, files[key].fullname);

                    console.log('文件上传成功:', r1.url);
                }
                else {
                    console.log('文件已存在:', key);
                }
            }
            console.log('全部上传完成！');
        }
        catch (e) {
            console.error('文件上传失败:', e);
            common.errorExit('上传文件到阿里云失败！');
        }
    }
}

const aliyun = new Yun();
const accessKeyId = common.getArgv('accessKeyId');
const accessKeySecret = common.getArgv('accessKeySecret');

aliyun.upload(accessKeyId, accessKeySecret, path.join(__dirname, '../dist/'));

