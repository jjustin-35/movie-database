# 電影資料庫 (Movie Database)

這是一個使用 Next.js 開發的電影資料庫網站，透過 TMDB API 獲取電影資訊，提供電影搜尋、收藏等功能。使用者可以瀏覽熱門電影、搜尋特定電影，並將喜愛的電影加入待看清單。

## 功能特色

- 瀏覽熱門電影列表
- 搜尋電影功能
- 電影排序功能（依照人氣、評分、上映日期）
- 電影詳細資訊頁面
- 待看清單功能（使用 localStorage 儲存）
- 響應式設計，支援多種裝置尺寸

## 安裝與啟動

### 前置需求

- Node.js 18.0.0 或更高版本
- Yarn 套件管理工具

### 安裝步驟

1. 複製專案到本地端

```bash
git clone <repository-url>
cd movie-database
```

2. 安裝相依套件

```bash
yarn install
```

3. 啟動開發伺服器

```bash
yarn dev
```

4. 開啟瀏覽器，前往 [http://localhost:3000](http://localhost:3000) 即可看到網站

### 其他指令

- 建置生產版本：`yarn build`
- 啟動生產版本：`yarn start`
- 執行程式碼檢查：`yarn lint`
- 執行測試：`yarn test`
- 持續監控測試：`yarn test:watch`

## 技術選型

### 前端框架與函式庫

- **Next.js 15.3.5**：React 框架，提供 SSR、檔案路由等功能
- **React 19.0.0**：React 前端框架
- **TypeScript**：靜態型別檢查，提升可維護性和安全性
- **TailwindCSS 4**：CSS 框架，用於快速開發 UI
- **SWR 2.3.4**：資料獲取與快取管理
- **Lucide React**：圖示函式庫
- **React Loading Skeleton**：載入中狀態的骨架屏組件

### 開發工具

- **ESLint**：程式碼品質檢查
- **Jest & React Testing Library**：單元測試與整合測試
- **Vercel Speed Insights**：線上效能監控

## 專案架構

```
movie-database/
├── app/                  
│   ├── page.tsx          
│   ├── layout.tsx        
│   ├── globals.css       
│   └── watch-list/       
├── components/           
│   ├── Header/           
│   ├── Movies/           
│   ├── SearchBar/        
│   ├── OrderButton/      
│   └── ...
├── config/               
│   └── index.ts          
├── constants/            
│   ├── apiPath.ts        
│   └── type.ts           
├── context/              
│   ├── index.tsx         
│   ├── toastContext.tsx  
│   └── watchListContext.tsx 
├── helpers/              
│   ├── fetcher.ts        
│   ├── getUrl.ts         
│   ├── orderList.ts      
│   └── transform.ts      
├── hooks/                
│   └── useMovie.ts       
├── public/               
├── __test__/             
│   └── hooks/            
├── .next/                
├── node_modules/         
├── .gitignore            
├── jest.config.ts        
├── next.config.ts        
├── package.json          
├── tsconfig.json         
└── README.md             
```

## 資料流

1. 使用 SWR 從 TMDB API 獲取電影資料
2. 透過自定義 Hooks (`useMovie.ts`) 處理 API 請求與資料轉換
3. 使用 React Context 管理全域狀態（待看清單、通知提示）
4. 元件透過 Props 和 Context 獲取並顯示資料

## API 整合

本專案使用 [TMDB (The Movie Database) API](https://www.themoviedb.org/documentation/api) 獲取電影資料。主要使用的 API 端點包括：

- `/movie/popular`：獲取熱門電影列表
- `/search/movie`：搜尋電影
- `/movie/{id}`：獲取電影詳細資訊
- `/movie/{id}/credits`：獲取電影演員與工作人員資訊
- `/movie/{id}/videos`：獲取電影相關影片

## 測試

本專案使用 Jest 和 React Testing Library 進行測試。測試檔案位於 `__test__` 目錄下。

### 測試架構

- 單元測試：測試個別函數和 Hooks
- 整合測試：測試元件與 Context 的互動

### 執行測試

```bash
# 執行所有測試
yarn test

# 持續監控模式
yarn test:watch
```

## 部署

本專案可以部署到任何支援 Next.js 的平台，推薦使用 Vercel 進行部署。

### Vercel 部署步驟

1. 在 GitHub 上建立專案儲存庫
2. 在 Vercel 上連結 GitHub 儲存庫
3. 設定環境變數（如需要）
4. 部署

## 貢獻指南

1. Fork 專案
2. 建立功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交變更 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 開啟 Pull Request

## 授權
本專案使用 MIT 授權 - 詳見 LICENSE 檔案
