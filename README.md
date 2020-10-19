# 🥩 [tenderize.me](https://tenderize.me)

> Don't just stake me, [tenderize.me](https://tenderize.me) first 🔨

---

## 💻 Develop

Setup initial dependencies:
```bash

lerna bootstrap

```
### Running the app:
#### Backend
```bash
cd packages/contracts
yarn buidler run scripts/deploy.ts --network development
yarn buidler node
```

#### Frontend
```bash
cd packages/tender-app
yarn start
```

Open http://localhost:3000
