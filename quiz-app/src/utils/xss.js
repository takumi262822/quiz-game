/**
 * XSS（クロスサイトスクリプティング）対策を統一管理するサニタイズクラス。
 * DOM 反映前に必ず経由する。
 * @author Takumi Harada
 */
export class XSSProtection {
    /**
     * 文字列をHTMLエンティティに変換（エスケープ処理）
     * XSS攻撃防止のため、ユーザー入力にはこのメソッドを使用
     * @param {string} str - 対象の文字列
     * @returns {string} エスケープ後の文字列
     */
    static escapeHTML(str) {
        if (!str) return '';
        if (typeof str !== 'string') {
            return '';
        }
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '/': '&#x2F;'
        };
        return str.replace(/[&<>"'/]/g, (m) => map[m]);
    }

    /**
     * innerHTMLの代わりに使用する安全なテキスト描画メソッド
     * textContentは自動的にエスケープされるため安全
     * @param {HTMLElement} el - 挿入先の要素
     * @param {string} text - 挿入するテキスト
     * @returns {boolean} 成功したかどうか
     */
    static safeSetText(el, text) {
        if (!el || !(el instanceof HTMLElement)) {
            console.warn('XSSProtection: 有効なDOMエレメントではありません');
            return false;
        }
        try {
            el.textContent = text;
            return true;
        } catch (error) {
            console.error('XSSProtection: テキスト設定エラー', error);
            return false;
        }
    }

    /**
     * HTMLコンテンツを安全に挿入（最小限のHTML許可）
     * @param {HTMLElement} el - 挿入先の要素
     * @param {string} html - 挿入するHTML文字列
     * @param {Array} allowedTags - 許可するタグ配列（デフォルトは基本タグのみ）
     * @returns {boolean} 成功したかどうか
     */
    static safeSetHTML(el, html, allowedTags = ['b', 'i', 'em', 'strong', 'br', 'p']) {
        if (!el || !(el instanceof HTMLElement)) {
            console.warn('XSSProtection: 有効なDOMエレメントではありません');
            return false;
        }
        try {
            // テンポラリ要素で検証
            const temp = document.createElement('div');
            temp.innerHTML = html;

            // スクリプトタグを完全に削除
            const scripts = temp.querySelectorAll('script');
            scripts.forEach(script => script.remove());

            // イベントハンドラーを削除
            const allElements = temp.querySelectorAll('*');
            allElements.forEach(element => {
                // すべての属性を確認
                Array.from(element.attributes).forEach(attr => {
                    if (attr.name.startsWith('on')) {
                        element.removeAttribute(attr.name);
                    }
                });

                // 許可されていないタグの場合、内容のみを保持
                if (!allowedTags.includes(element.tagName.toLowerCase())) {
                    // タグを削除し、内容を保持
                    while (element.firstChild) {
                        element.parentNode.insertBefore(element.firstChild, element);
                    }
                    element.parentNode.removeChild(element);
                }
            });

            el.innerHTML = temp.innerHTML;
            return true;
        } catch (error) {
            console.error('XSSProtection: HTML設定エラー', error);
            return false;
        }
    }

    /**
     * URLが安全かチェック（スキームの検証）
     * @param {string} url - チェック対象のURL
     * @returns {boolean} 安全ならtrue
     */
    static isSafeURL(url) {
        if (!url || typeof url !== 'string') {
            return false;
        }
        try {
            const urlObj = new URL(url, window.location.href);
            const safeProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
            return safeProtocols.includes(urlObj.protocol);
        } catch {
            // 相対URLの場合
            if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
                return true;
            }
            return false;
        }
    }

    /**
     * 安全なリンク属性を設定
     * @param {HTMLElement} el - リンク要素
     * @param {string} href - リンク先URL
     * @returns {boolean} 成功したかどうか
     */
    static setSafeHref(el, href) {
        if (!this.isSafeURL(href)) {
            console.warn('XSSProtection: 不安全なURLです', href);
            return false;
        }
        try {
            el.href = href;
            return true;
        } catch (error) {
            console.error('XSSProtection: href設定エラー', error);
            return false;
        }
    }

    /**
     * JSONを安全にパース
     * @param {string} jsonStr - JSON文字列
     * @returns {object|null} パース結果、エラーの場合null
     */
    static safeJSONParse(jsonStr) {
        try {
            return JSON.parse(jsonStr);
        } catch (error) {
            console.error('XSSProtection: JSON解析エラー', error);
            return null;
        }
    }

    /**
     * DOM操作で安全なクラス名を設定
     * @param {HTMLElement} el - 対象要素
     * @param {string} className - クラス名
     * @returns {boolean} 成功したかどうか
     */
    static safeSetClass(el, className) {
        if (!el || !(el instanceof HTMLElement)) {
            return false;
        }
        if (typeof className !== 'string') {
            return false;
        }
        try {
            el.className = className;
            return true;
        } catch (error) {
            console.error('XSSProtection: class設定エラー', error);
            return false;
        }
    }
}
