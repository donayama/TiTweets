// tab2.js
var win = Titanium.UI.currentWindow;
// 公式アカウントの一覧
var tableView = Titanium.UI.createTableView({
	data : [{
		title: '#titanium',
		url: 'win3.js',
		hasChild: true
	},{
		title: '#titaniumJP',
		url: 'win4.js',
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