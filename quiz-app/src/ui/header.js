/**
 * Header クラス - ヘッダークラス
 * ゲームページ共通ヘッダーの生成・管理
 * @author Takumi Harada
 * @date 2026-03-31
 */
/**
 * Header クラス
 * 目的: UI部品の生成・更新を担当する
 * 入力: 表示データ・DOM要素・操作イベント
 * 処理: 画面要素を生成/更新し必要なイベントを接続する
 * 出力: 更新されたUI表示
 * 補足: ビジネスロジックは別クラスに分離する
 * @author Takumi Harada
 * @date 2026-04-01
 */
export class Header {
    /**
     * @param {string} title    - ヘッダータイトル
     * @param {string} subtitle - サブタイトル（レベル名など）
     */
    constructor(title = '', subtitle = '') {
        this.title    = title;
        this.subtitle = subtitle;
        this.el       = null;
    }

    /**
     * ヘッダー要素を生成して指定セレクタの先頭に挿入
     * @param {string} targetSelector - 挿入先 CSS セレクタ
     * @returns {boolean} 成功したか
     */
    render(targetSelector = 'body') {
        const target = document.querySelector(targetSelector);
        if (!target) return false;

        this.el = document.createElement('header');
        this.el.className = 'game-header';
        this.el.innerHTML =
            `<h2 class="game-header__title">${this.title}</h2>` +
            `<span class="game-header__subtitle">${this.subtitle}</span>`;
        target.prepend(this.el);
        return true;
    }

    /**
     * ヘッダーのテキストを更新
     * @param {string} title
     * @param {string} subtitle
     */
    update(title, subtitle) {
        this.title    = title;
        this.subtitle = subtitle;
        if (!this.el) return;
        this.el.querySelector('.game-header__title').textContent    = title;
        this.el.querySelector('.game-header__subtitle').textContent = subtitle;
    }

    /** ヘッダー要素を DOM から削除 */
    remove() {
        if (this.el) {
            this.el.remove();
            this.el = null;
        }
    }
}
