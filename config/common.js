/* eslint-disable global-require */
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const launcherpkg = require('../package.json');

module.exports = {

    getVersion(version) {
        const versionTag = version.charAt(0);

        switch (versionTag) {
            case '^':
            case '~':
            case '*':
                return version.substr(1);
        }

        return version;
    },
    checkVFNodeModuleVersion(name) {
        // 检测版本是否正常
        console.log(name, launcherpkg.devDependencies[name]);
        const vfEngineVersion = this.getVersion(launcherpkg.devDependencies[name]);
        const localVFPackage = require(`../node_modules/${name}/package.json`);

        if (vfEngineVersion !== localVFPackage.version) {
            console.log('\x1b[36m', `error 请升级 ${name} 执行 : npm i ${name}@${vfEngineVersion}`, '\x1b[0m');

            return false;
        }

        return true;
    },
    /**
     * 检测GUI，VF的版本是否正确
     */
    checkVersion() {
        // 检测VF版本是否正常
        if (!this.checkVFNodeModuleVersion('@vf.js/vf')) {
            this.errorExit('vf版本异常');
        }
        // 检测VF版本是否正常
        if (!this.checkVFNodeModuleVersion('@vf.js/gui')) {
            this.errorExit('gui版本异常');
        }
    },
    /**
     * 获取当前引擎引用库的版本
     */
    versions() {
        return {
            vf: this.getVersion(launcherpkg.devDependencies['@vf.js/vf']),
            gui: this.getVersion(launcherpkg.devDependencies['@vf.js/gui']),
            player: this.getVersion(launcherpkg.devDependencies['@vf.js/player']),
            launcher: launcherpkg.version,
        };
    },
    /**
     * 异常退出
     */
    errorExit(errStr) {
        process.exitCode = 1;
        throw new Error(errStr);
    },

    /**
     * 获取文件夹，文件列表
     * @param {*} filePath 目录
     * @param {*} tmpPath 虚拟临时目录，一般相对dist
     */
    getDirFile(filePath, tmpPath, outfiles = [], filterArr = []) {
        const fileArr = fs.readdirSync(filePath);

        fileArr.forEach((file) => {
            const key = path.join(tmpPath, file);
            const newFile = path.join(filePath, file);

            if (fs.statSync(newFile).isDirectory()) {
                this.getDirFile(newFile, path.join(tmpPath, file), outfiles, filterArr);
            }
            else {
                let isPut = true;

                filterArr.forEach((filter) => {
                    const idx = key.lastIndexOf(filter);

                    if (idx > 0 && key.length - filter.length === idx) {
                        isPut = false;
                    }
                });

                if (isPut) {
                    outfiles[key] = {
                        fullname: newFile,
                    };
                }
            }
        });

        return outfiles;
    },
    /**
     * 清空目录
     */
    clearDistPath(distPath) {
        if (fs.existsSync(distPath)) {
            fs.rmSync(distPath, { recursive: true });
        }
    },
    /**
     * 获取命令行中的参数
     *
     *  npm run upload accessKeyId=xxxxx accessKeySecret=aaaaa
     *
     *  getArgv('accessKeyId') -> xxxxx
     *
     * @param {*} key 关键值
     * @returns str
     */
    getArgv(key) {
        for (let i = 2; i < process.argv.length; i++) {
            if (process.argv[i].indexOf(`${key}=`) !== -1) {
                return process.argv[i].substr(process.argv[i].indexOf('=') + 1);
            }
        }

        return undefined;
    },

};
