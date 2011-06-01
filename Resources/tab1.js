// tab1.js
var win = Titanium.UI.currentWindow;
// 公式アカウントの一覧
var tableView = Titanium.UI.createTableView({
	data : [{
		title: '@appcelerator',
		url: 'win1.js',
		hasChild: true
	},{
		title: '@appcelerator_ja',
		url: 'win2.js',
		hasChild: true
	}
	]
});
win.add(tableView);

// TableView選択時のイベント
tableView.addEventListener('click', function(e) {
	// TableViewRowの各データにアクセスするにはe.rowDataを介する
	var newWindowUrl = e.rowData.url;
	var newWindow = Titanium.UI.createWindow({
		title: e.row.title,
		backgroundColor: '#fff',
		url: newWindowUrl
	});
	Titanium.UI.currentTab.open(newWindow);
});