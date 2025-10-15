# imio-web

这个项目作为聊天界面

### 整合 buffer 

1. npm install vite-plugin-node-polyfills --save-dev
2. vite.config.js

```js
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
    plugins: [
        nodePolyfills({
            // 明确指定需要 polyfill 的模块
            include: ['buffer'],
            // 配置 buffer 全局变量
            buffer: {
                global: true,
            },
        }),
    ],
});
```



## Install
```shell
npm install
```
## Run
```shell
npm run serve
```
## Build
### Build for Production
```shell
npm run build
```
### Build for Staging
```shell
npm run build:staging
```
## Preview
### Preview for Production
```shell
npm run preview
```
### Preview for Staging
```shell
npm run preview:staging
```
## .env Description

- This project exposes environment variables on `import.meta.env` object.
- Different modes (development/staging/production) correspond to different environment files (.env.*).
- .env file is always included, duplicate variables are overwritten by the specific mode file (.env.*).
