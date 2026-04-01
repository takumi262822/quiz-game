/**
 * StyleManager クラス - CSSクラス
 * スタイルシートの動的ロード・管理
 * @author Takumi Harada
 * @date 2026-03-31
 */
/**
 * StyleManager クラス
 * 目的: UI部品の生成・更新を担当する
 * 入力: 表示データ・DOM要素・操作イベント
 * 処理: 画面要素を生成/更新し必要なイベントを接続する
 * 出力: 更新されたUI表示
 * 補足: ビジネスロジックは別クラスに分離する
 * @author Takumi Harada
 * @date 2026-04-01
 */
export class StyleManager {
    static #loaded = new Set();

    /**
     * 指定した CSS ファイルを動的に読み込む（重複読み込み防止付き）
     * @param {string} href - スタイルシートのパス（または URL）
     */
    static load(href) {
        if (this.#loaded.has(href)) return;
        const link = document.createElement('link');
        link.rel  = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
        this.#loaded.add(href);
    }

    /**
     * 指定した CSS ファイルを DOM から取り除く
     * @param {string} href
     */
    static unload(href) {
        document.querySelectorAll(`link[rel="stylesheet"][href="${href}"]`)
            .forEach(l => l.remove());
        this.#loaded.delete(href);
    }

    /**
     * 現在ロード済みのスタイルシート一覧を返す
     * @returns {string[]}
     */
    static getLoaded() {
        return [...this.#loaded];
    }
}
