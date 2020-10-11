# 🥩 [tenderize.me](https://tenderize.me)

> don't just stake me, [tenderize.me](https://tenderize.me) first 🔨

---

## 💻 Develop

Setup dependencies:
```bash

lerna bootstrap

```
### Running the app:
Terminal 1:
```bash
cd packages/app/tender-app
yarn start
```

Terminal 2:
```bash
cd packages/contracts
yarn build
yarn buidler node
```

Terminal 3:
```bash
cd packages/contracts
yarn buidler run scripts/deploy.ts --network development
```
