/**
 * GameConstants クラス - 定数クラス
 * クイズゲームの数値・配列定数を一元管理
 * @author Takumi Harada
 * @date 2026-03-31
 */
export class GameConstants {
    // --- 問題数 ---
    static QUESTION_COUNT = 10;

    // --- タイミング（ミリ秒） ---
    static STANDARD_DELAY   = 1800;  // 正誤判定を見せる時間（通常）
    static CORRECT_DELAY    = 1200;  // 正解後の次問題遷移待機
    static LOSE_DELAY       = 800;   // 不正解後のゲームオーバー遷移
    static CPA_DELAY        = 2500;  // 正誤判定を見せる時間（CPA）
    static CPA_LOSE_DELAY   = 1000;  // CPA 不正解後の遷移

    // --- ポータル秘密ゲート ---
    static SECRET_CLICKS    = 6;     // CPA 解放に必要なクリック数
    static RUMBLE_THRESHOLD = 4;     // 振動エフェクトが始まるクリック数
    static RESET_TIMEOUT    = 1200;  // クリックリセットまでの待機(ms)
    static UNLOCK_DELAY     = 200;   // 解放後のダイアログ表示遅延(ms)

    // --- 賞金テーブル（通常 / CPA） ---
    static STANDARD_REWARDS = Object.freeze([
        "10,000", "20,000", "30,000", "50,000", "100,000",
        "150,000", "250,000", "500,000", "750,000", "1,000,000"
    ]);

    static CPA_REWARDS = Object.freeze([
        "10,000", "100,000", "500,000", "1,000,000", "2,000,000",
        "4,000,000", "6,000,000", "8,000,000", "9,000,000", "10,000,000"
    ]);
}
