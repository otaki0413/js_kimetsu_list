import { BASE_URL, API_URL, VALID_CATEGORIES } from './const.js';
import { sleep } from './util.js';

// ローディング機能作成
const loading = createLoadingController();

// キャラクター初期表示
displayCharacters('all');

// ラジオボタン切替時の処理設定
const radioButtonForm = document.querySelector('.radio-button-form');
radioButtonForm.addEventListener('change', (e) =>
  displayCharacters(e.target.value)
);

/**
 * キャラクター表示用の処理
 * @param {string} category - キャラクターのカテゴリ
 */
async function displayCharacters(category) {
  // カテゴリの有効チェック
  if (!VALID_CATEGORIES.includes(category)) {
    alert('不正なカテゴリです。');
    return;
  }

  try {
    // ローディング表示
    loading.show();
    // 1秒スリープ（※ローディング状態を確認するために設置しています）
    await sleep(1000);
    // キャラクター取得
    const characters = await getCharacters(category);
    // キャラクター一覧作成
    createCharacterList(characters);
  } catch (error) {
    console.error(error);
  } finally {
    // ローディング非表示
    loading.hide();
  }
}

/**
 * カテゴリ値に応じたキャラクターを取得する処理
 * @param {string} category - キャラクターのカテゴリ
 * @returns {Promise<Object[]>} キャラクター情報の配列
 */
async function getCharacters(category = 'all') {
  // リクエスト先のエンドポイント設定
  const url = `${API_URL}/${category}.json`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`ステータスコード: ${response.status}`);
    }
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * キャラクター一覧を作成する処理
 * @param {Object[]} characters キャラクター情報の配列
 */
function createCharacterList(characters) {
  // キャラクター一覧
  const characterList = document.querySelector('.character-list');
  characterList.innerHTML = '';

  // キャラクターの数分ループ処理
  characters.forEach((character) => {
    // キャラクター表示用のカード
    const card = document.createElement('div');
    card.classList.add('character-card');

    // キャラクター名
    const characterName = document.createElement('h3');
    characterName.textContent = character.name;
    characterName.classList.add('character-name');

    // カテゴリ名
    const characterCategory = document.createElement('div');
    characterCategory.textContent = character.category;
    characterCategory.classList.add('character-category');

    // キャラクター画像
    const characterImage = document.createElement('img');
    characterImage.src = `${BASE_URL}${character.image}`;
    characterImage.classList.add('character-image');

    // キャラクターに関する各要素をカードの子要素として追加
    card.append(characterName, characterCategory, characterImage);
    // カードをキャラクター一覧の子要素として追加
    characterList.appendChild(card);
  });
}

/**
 * ローディング制御のためのコントローラーを生成する処理
 */
function createLoadingController() {
  const loadingElement = document.querySelector('.loading');
  return {
    show: () => {
      loadingElement.style.display = 'block';
    },
    hide: () => {
      loadingElement.style.display = 'none';
    },
  };
}
