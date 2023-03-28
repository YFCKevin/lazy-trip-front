# Lazy Trip

## 關於
緯育 TGA105 第 3 組專題製作，網站前端部分。  
後端：[https://github.com/JunliXiao/lazy-trip-back](https://github.com/JunliXiao/lazy-trip-back)

## 分工
瀚賢：會員系統、管理員後台  
奕帆：行程系統、串接 Google Map API  
常富：訂房系統、串接 LinePay + Google Map API  
俊立：好友系統、多人聊天、網站設計風格  
思德：揪團系統、聊天室  
力維：廠商房型系統  
永澄：首頁、推薦文章、客服聊天  

## 目錄結構
asset 存放共同資源，如每一頁都會使用的 css、js、圖檔；sass 為自訂 Bulma 框架時所使用；vendor 存放外部函式庫的原始碼。  
page 存放每個人負責的功能對應的資料夾，各自存放專屬其功能的 html、css 等資源。  
基本上，大家應該都是只編輯自己資料夾的內容，某些人或某些時候才會去編輯共同的首頁、頁首或 asset 等。  
參考：[Re: [討論] 同一個程式碼段落超過一人以上在修改](https://www.ptt.cc/bbs/Soft_Job/M.1679371712.A.067.html)
- root
  - asset
    - css
    - img
    - js
    - sass
    - vendor
  - page
    - article、datetimepicker、customerService (永澄)
    - comapny (力維)
    - friend (俊立)
    - group (思德)
    - member (瀚賢)
    - order (常富)
    - tour (奕帆)
    - 登入頁等 (瀚賢)
  - 首頁、README 文件等 (永澄、俊立)
  
## 版本控制
~~main 分支~~  
僅使用 dev 分支。  
每個人每次推 commit 到遠端 dev 分支，即一次進度整合；每次拉 commit 到每個人本地 dev 分支，即一次更新。每次推 commit 時，除非離上次推的時間內沒有別人推過，不然都會需要先 merge 或 rebase 別人推的 commit。在大家沒有更動到別人的負責目錄的前提下，通常不會遇到衝突需要處理。

## CSS 框架

### 概念
[Bulma](https://bulma.io) 是一個純 CSS 框架，為常用的 UI 元件定義出好看美觀的樣式，只要在 HTML 元素內加入適當的 class，即可套用。這些 Bulma 定義的 class 除了大部分是 button、form 這類 UI 名詞外，還有少部分為 is- 或 has- 開頭的修飾詞，用於選擇適合情境的顏色和排版等，例：is-primary、has-text-centered。

### 開發原則
1. 盡量利用 Bulma 提供的 CSS class 實現 UI 設計跟效果。
2. 考慮顏色時，思考使用情境，盡量從 primary、link、info 等這些定義好的分類中選擇。
3. Bulma 無法滿足需求時，建議尋求單純的 css、js 寫法來實現，避免外部函式庫；jQuery 可以用。
4. 使用自定義的寫法時，依照適用的範圍，來思考該寫在元素內 inline，還是寫在獨立的檔案。
5. 若有排版上間距的考量，可使用 Bulma 的 [Block](https://bulma.io/documentation/elements/block/) 或 [Spacing](https://bulma.io/documentation/helpers/spacing-helpers/)。

### 常見需求
每個項目的第一個子項目為簡短說明，第二個子項目起為架構範例
- [欄 / Columns](https://bulma.io/documentation/columns/basics/)
  - 製作 n 欄式的版面，欄寬會自動計算，或可額外設定；可和 [Tiles](https://bulma.io/documentation/layout/tiles/) 比較
  - columns
    - column
    - column
    - ...
- [按鈕 / Button](https://bulma.io/documentation/elements/button/)
  - 一顆很棒的按鈕，顏色、大小、形式皆可設定
  - buttons
    - button
    - ...
  - field is-grouped
    - control
      - button
    - ...
- [內容 / Content](https://bulma.io/documentation/elements/content/)
  - 作為包含基本 HTML 標籤 / 文字內容的上層元素
  - content
    - h1
    - p
    - ol
    - ...
- [圖示 / Icon](https://bulma.io/documentation/elements/icon/)
  - 一個很棒的 icon，可單獨存在，也可放進別的元素搭配
  - icon-text
    - icon
      - fas fa-xxx
    - span text
- [下拉式選單 / Dropdown](https://bulma.io/documentation/components/dropdown/)
  - 偏向介面操作的功能選單，可和表單裡的 select 標籤進行比較
  - dropdown
    - dropdown-trigger
      - button
    - dropdown-menu
      - dropdown-content
        - dropdown-item
- [表單 / Form](https://bulma.io/documentation/form/general/)
  - 使用上最複雜的元素；先考慮有哪些欄位，安排好架構後再設定 icon 跟排版
  - form
    - field
      - label
      - control
  - control 底下僅可包含這四種 Bulma 元素：input / select / button / icon
- [燈箱 / Modal](https://bulma.io/documentation/components/modal/)
  - 使用步驟較複雜，除了本體的 html 外，還要準備按鈕跟偵測事件的 js，但可以帶來更好的體驗
  - modal
    - modal-background
    - modal-content
    - modal-close
  - modal
    - modal-background
    - modal-card
      - modal-card-head
        - modal-card-title
      - modal-card-body
      - modal-card-foot
- [字體排版 / Typography](https://bulma.io/documentation/helpers/typography-helpers/)
  - 針對性地設定字體大小或對齊方式

> 注意： 少數元件須額外補上 JavaScript 才能正常運作 (尋找元素 -> 綁定事件 -> 設定事件觸發的動作)，其介紹都有附上範例代碼。  

> 關於 icon：必須在 head 標籤裡引入 [Font Awesome](https://fontawesome.com)，並使用 fas 這一系列；同一頁面內使用不同系列的 icon，將無法顯示。

### 自訂
Bulma 的原始碼內分別有兩個檔案包含：初始變數 (initial variables)，和從初始變數設定而來的衍生變數 (derived variables)。Bulma 的 CSS class 便是透過 [Sass](https://sass-lang.com/guide) 工具，基於這些變數組合出來的各種樣式。也因此，[自訂樣式的過程](https://bulma.io/documentation/customize/with-sass-cli/)就是將變數重新定義後，編譯出一個我們所需的 css 檔，即 my-bulma.css。  
如果你對顏色、字體、間隔等各種參數有整體性的想法，是會影響到所有人的頁面，就提出來討論吧！只要能稍加研究一下，認識到該調整哪些變數，自訂的過程其實很快，一點也不麻煩。

## Anything Else
Work in progress...



