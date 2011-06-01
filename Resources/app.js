// ベース色は黒
Titanium.UI.setBackgroundColor('#000');

// TabGroupを作成する
var tabGroup = Titanium.UI.createTabGroup();

// １番目のタブの定義
var tab1 = Titanium.UI.createTab({
	icon: 'dark_appcelerator.png',
	title: '公式アカウント',
	window: Titanium.UI.createWindow({
		title: '公式アカウント',
		backgroundColor: '#fff',
		url: 'tab1.js'
	})
});

// ２番目のタブの定義
var tab2 = Titanium.UI.createTab({
	icon: 'dark_pegman.png',
	title: 'ハッシュタグ',
	window: Titanium.UI.createWindow({
		title: 'ハッシュタグ',
		backgroundColor: '#fff',
		url: 'tab2.js'
	})
});

// ３番目のタブの定義
// スクリプトの引用例
Titanium.include('tab5.js');

// ４番目のタブの定義
var tab4 =  Titanium.UI.createTab({
	icon: 'dark_wrench.png',
	title: '設定',
	window: Titanium.UI.createWindow({
		title: '設定',
		backgroundColor: '#fff',
		url: 'win0.js',
		barColor: '#000'
	})
});

// タブを追加しTabGroupを表示する
tabGroup.addTab(tab1);
tabGroup.addTab(tab2);
tabGroup.addTab(tab5);
tabGroup.addTab(tab4);
tabGroup.open();