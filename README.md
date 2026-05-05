# FXエリオット波動チェッカー

エリオット波動を自動検出し、Buy / Sell / Wait シグナルをひと目で表示する Android 向け FX チャート分析アプリ。

## 機能

- 主要7通貨ペア対応（USD/JPY、EUR/JPY、GBP/JPY、AUD/JPY、EUR/USD、GBP/USD、AUD/USD）
- 8種類の時間足（1分・5分・15分・30分・1時間・4時間・日足・週足）
- ZigZag アルゴリズムによるピボット検出
- 推進波（1-2-3-4-5）と修正波（A-B-C）の自動描画
- フィボナッチ・リトレースメント表示（23.6 / 38.2 / 50 / 61.8 / 78.6%）
- Buy / Sell / Wait シグナル
- ZigZag 感度調整
- デモモード搭載（APIキー不要で動作確認可）

## 技術スタック

- React Native (Expo SDK 52)
- TypeScript
- Zustand（状態管理 + AsyncStorage 永続化）
- React Native SVG（チャート描画）
- React Native Google Mobile Ads（AdMob）
- Alpha Vantage API（為替レートデータ）

## 開発

```bash
# 依存インストール
npm install

# Expo 開発サーバー起動
npm start

# Android 実機/エミュレータで起動
npm run android
```

## ビルド

EAS Build を使用：

```bash
# プレビュー APK（社内配布・実機検証用）
eas build --profile preview --platform android

# 本番 AAB（Google Play 提出用）
eas build --profile production --platform android
```

## ディレクトリ構成

```
src/
├── algorithms/     # エリオット波動検出ロジック
├── components/     # 再利用コンポーネント（チャート・シグナルパネル等）
├── screens/        # 画面コンポーネント
├── services/       # 外部 API クライアント（Alpha Vantage）
├── store/          # Zustand ストア
└── types/          # TypeScript 型定義
```

## プライバシーポリシー

https://zeroichi-code.github.io/fx-elliott-app/privacy.html

## ライセンス

MIT License — 詳細は [LICENSE](./LICENSE) 参照。

## 免責事項

本アプリは投資判断を支援する分析ツールです。売買を推奨・保証するものではなく、最終的な取引判断は利用者自身の責任で行ってください。レートデータの正確性・リアルタイム性は保証されません。

## 開発者

zeroichi-code — https://github.com/zeroichi-code
