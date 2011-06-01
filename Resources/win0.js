// win0.js
var win = Titanium.UI.currentWindow;

var tableView = Titanium.UI.createTableView({
	style: Titanium.UI.iPhone.TableViewStyle.GROUPED
});

// 見出し用の行
tableView.appendRow((function() {
	var row = Titanium.UI.createTableViewRow({
		height:40,
		backgroundColor:'#ccc'
	});
	row.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
	row.add(Titanium.UI.createLabel({
		text: 'Read It Later アカウント設定',
		height:'auto',
		left:8,
		width:300
	}));
	return row;
})());
// 設定入力用のTextFieldを作成する。
var ril_username = Titanium.UI.createTextField({
	color:'#336699',
	height:35,
	top:8,
	left:120,
	width:160,
	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
	// スペルチェック機能をオフ
	autocorrect: false,
	// 自動大文字化機能も無効にする
	autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE
});
var ril_password = Titanium.UI.createTextField({
	color:'#336699',
	height:35,
	top:8,
	left:120,
	width:160,
	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
	passwordMask: true,
	// スペルチェック機能をオフ
	autocorrect: false,
	// 自動大文字化機能も無効にする
	autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE
});
// 設定選択用のRowを作成する
tableView.appendRow((function() {
	var row = Titanium.UI.createTableViewRow({
		height:60,
		backgroundColor:'#fff'
	});
	row.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
	row.add(Titanium.UI.createLabel({
		text: 'ユーザ名',
		height: 35,
		left:8,
		top:8,
		width:100
	}));
	row.add(ril_username);
	return row;
})());
tableView.appendRow((function() {
	var row = Titanium.UI.createTableViewRow({
		height:60,
		backgroundColor:'#fff'
	});
	row.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE;
	row.add(Titanium.UI.createLabel({
		text: 'パスワード',
		height: 35,
		left:8,
		top:8,
		width:100
	}));
	row.add(ril_password);
	return row;
})());
tableView.appendRow((function() {
	var row = Titanium.UI.createTableViewRow({
		height:60,
		backgroundColor:'#fff'
	});
	row.add(Titanium.UI.createLabel({
		text: '保存する',
		height: 35,
		left:8,
		top:8,
		width:300,
		textAlign: 'center'
	}));
	return row;
})());
// TableViewクリック時のイベント(保存するボタン)
tableView.addEventListener('click', function(e) {
	if(e.index === 3) {
		Ti.App.Properties.setString('ril_username', ril_username.value);
		Ti.App.Properties.setString('ril_password', ril_password.value);
	}
});
win.add(tableView);