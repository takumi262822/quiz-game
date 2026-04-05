/**
 * クイズ各難易度画面の共通ヘッダー（タイトル・サブタイトル）を生成・插入する UI クラス。
 * @author Takumi Harada
 * @date 2026/3/31
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
