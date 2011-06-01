// win5.jsのwindowを変数にセット
var win = Titanium.UI.currentWindow;

// ライブラリの読み込み
Titanium.include('titwitter.js');

// SearchBarとTableViewの追加
var searchBar = Titanium.UI.createSearchBar({
	showCancel:true,
	height:43,
	top:0
});
TiTwitter.UI.tableView.top = 43;
win.add(searchBar);
win.add(TiTwitter.UI.tableView);

// 再読込の設定
TiTwitter.UI.setRefreshButton( function() {
	TiTwitter.loadSearchResult(searchBar.value);
});
// 検索開始とキーボードを閉じるイベントを設定する
searchBar.addEventListener('cancel', function() {
	searchBar.blur();
});
searchBar.addEventListener('return', function() {
	// 検索語の保存
	Titanium.App.Properties.setString('query_string', searchBar.value);
	searchBar.blur();
	TiTwitter.loadUserTimeline(searchBar.value);
});
// 保存された検索語があれば初期表示
if(Titanium.App.Properties.getString('query_string', null) != null) {
	searchBar.value = Titanium.App.Properties.getString('query_string');
	TiTwitter.loadUserTimeline(searchBar.value);
}