/**
 * UIComponents クラス - 共通部品クラス
 * QuizManager / QuizEngineCPA が共用する UI 構築メソッドを集約
 * @author Takumi Harada
 * @date 2026-03-31
 */
/**
 * UIComponents クラス
 * 目的: UI部品の生成・更新を担当する
 * 入力: 表示データ・DOM要素・操作イベント
 * 処理: 画面要素を生成/更新し必要なイベントを接続する
 * 出力: 更新されたUI表示
 * 補足: ビジネスロジックは別クラスに分離する
 * @author Takumi Harada
 * @date 2026-04-01
 */
/**
 * 処理概要:
 * - 生成処理: 選択肢ボタンや報酬一覧などクイズ画面で使う共通UIを組み立てる
 * - 更新処理: 回答状態に応じてクラス付与や表示内容を切り替える
 * - 出力処理: QuizManager から再利用できる DOM 部品を返す
 */
export class UIComponents {
    /**
     * 選択肢ボタンを生成して返す
     * @param {string}   text    - ボタンに表示するテキスト
     * @param {Function} onClick - クリック時のコールバック
     * @returns {HTMLButtonElement}
     */
    static createChoiceButton(text, onClick) {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.textContent = text;
        btn.onclick = onClick;
        return btn;
    }

    /**
     * 賞金リストを描画する
     * @param {HTMLElement} container - 描画先の <ul> 要素
     * @param {string[]}    rewards   - 賞金文字列の配列（昇順）
     */
    static renderRewardList(container, rewards) {
        container.innerHTML = rewards.slice().reverse().map((m, i) => {
            const idx = rewards.length - 1 - i;
            return `<li id="m-${idx}">▶ ￥${m}</li>`;
        }).join('');
    }

    /**
     * 現在問題インデックスに対応する賞金リストをハイライトする
     * @param {number} index - 現在の問題インデックス（0 始まり）
     */
    static highlightReward(index) {
        document.querySelectorAll('.reward-sidebar li')
            .forEach(li => li.classList.remove('active'));
        const active = document.getElementById(`m-${index}`);
        if (active) active.classList.add('active');
    }

    /**
     * 結果モーダルを表示する
     * @param {HTMLElement} modalEl - #result-modal 要素
     * @param {string}      title   - 大見出し（BRILLIANT! など）
     * @param {string}      msg     - 本文メッセージ
     */
    static showModal(modalEl, title, msg) {
        modalEl.style.display = 'flex';
        document.getElementById('res-title').textContent = title;
        document.getElementById('res-msg').textContent   = msg;
    }
}
