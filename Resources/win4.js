// win4.jsのwindowを変数にセット
var win = Titanium.UI.currentWindow;

// ライブラリの読み込み
Titanium.include('titwitter.js');

// TableViewの追加
win.add(TiTwitter.UI.tableView);

// 再読込の設定
TiTwitter.UI.setRefreshButton( function() {
	TiTwitter.loadSearchResult('#TitaniumJP');	// 固定パラメータ
});
// 初回読み込み
TiTwitter.loadSearchResult('#TitaniumJP');	// 固定パラメータ