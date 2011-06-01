// titwitter.js
var TiTwitter = {};
(function() {
	// UI関連
	TiTwitter.UI = {};
	// 本体となるTableViewはここで宣言しておく。
	TiTwitter.UI.tableView = Titanium.UI.createTableView();
	// 単独Tweet表示Windowを生成する。
	TiTwitter.UI.createTweetWindow = function(thisTweet) {
		// 新しいWindowを生成し、現在のTabにぶら下げて表示
		var newWindow = Ti.UI.createWindow({
			title: 'Tweet',
			backgroundColor: '#fff'
		});
		// 上部のUser情報表示
		newWindow.add((function() {
			var view = Titanium.UI.createView({
				top:0,
				height:80,
				backgroundColor: '#ccc'
			});
			view.add(Titanium.UI.createImageView({
				image: thisTweet.user.profile_image_url,
				top:8,
				left:8,
				width:64,
				height:64
			}));
			view.add(Titanium.UI.createLabel({
				top:8,
				left:80,
				right:8,
				height:'auto',
				text: thisTweet.user.name
			}));
			view.add(Titanium.UI.createLabel({
				top:30,
				left:80,
				height:'auto',
				text: '@' + thisTweet.user.screen_name,
				font: {
					fontSize:12
				}
			}));
			view.add(Titanium.UI.createLabel({
				bottom:8,
				left:80,
				height:'auto',
				text: thisTweet.user.url,
				font: {
					fontSize:11
				}
			}));
			return view;
		})());
		// 下段のTweet表示
		newWindow.add((function() {
			var webView = Titanium.UI.createWebView({
				top:80
			});
			webView.html = '<html><body style="padding:8px"><div>' + thisTweet.text + '</div>' +
			' <div>' + String.formatDate(new Date(thisTweet.created_at), "long") + " " +
			String.formatTime(new Date(thisTweet.created_at)) + '</div></body></html>' ;
			return webView;
		})());
		// 右Navigationもしくはメニューとしてアクション表示
		var url = 'http://twitter.com/' + thisTweet.user.screen_name + '/status/' + thisTweet.id_str;
		if(Titanium.Platform.osname === 'android') {
			newWindow.addEventListener('open', function() {
				var intent = Titanium.Android.createIntent({
					action: Titanium.Android.ACTION_SEND,
					type: "text/plain"
				});
				intent.putExtra(Titanium.Android.EXTRA_TEXT, url);
				Titanium.Android.currentActivity.startActivity(Titanium.Android.createIntentChooser(intent, "Choose App"));
			});
		} else {
			newWindow.rightNavButton = (function() {
				var button = Titanium.UI.createButton({
					systemButton: Titanium.UI.iPhone.SystemButton.ACTION
				});
				button.addEventListener('click', function() {
					TiTwitter.UI.showOptionDialog(thisTweet, url);
				});
				return button;
			})();
		}
		return newWindow;
	};
	// iPhone向けオプションダイアログの表示を行う。
	TiTwitter.UI.showOptionDialog = function(tweet, url) {
		// 選択ダイアログの生成
		var dialog = Titanium.UI.createOptionDialog({
			// タイトル（プロンプト）
			title: '処理を選択してください。',
			// ボタンの配置（ちなみに配列なので0オリジンでindexをもつ）
			// ボタンの配置
			options: ["Safari","Twitter for iPhone","E-mail","Read it Later","キャンセル"],
			// キャンセルボタンは見た目を変えることができます。
			cancel: 4
		});

		// ボタン選択時の処理はイベントハンドラを記述します。
		dialog.addEventListener('click', function(e) {
			// キャンセル時はe.cancel === trueとなる
			if(e.cancel === true) {
				return;
			}
			// ボタン選択時挙動
			if(e.index == 0) {
				Titanium.Platform.openURL(url);
			} else if(e.index == 1) {
				Titanium.Platform.openURL('twitter:' + url);
			} else if(e.index === 2) {
				(function() {
					var emailDialog = Titanium.UI.createEmailDialog();
					// 題名の初期値をセットします
					emailDialog.subject = 'Twitter';
					// 本文の初期値をセットします。
					emailDialog.messageBody = tweet.text + "\n" + url;
					// ダイアログを開く
					emailDialog.open();
				})();
			} else if(e.index === 3) {
				var apiUrl = 'https://readitlaterlist.com/v2/add';
				var ril_username = Titanium.App.Properties.getString('ril_username', null);
				var ril_password = Titanium.App.Properties.getString('ril_password', null);
				if(ril_username == null || ril_password == null) {
					// 未設定時の入力を促す。
					alert('Read It Laterのアカウント設定をしてください。');
					Titanium.UI.currentTabGroup.setActiveTab(3);
					return;
				}
				var apiParams = {
					apikey:   'f56Abm9eduUqMk9864p3dt0XO0T0e8bs',
					username: ril_username,
					password: ril_password,
					url:      url
				};
				TiTwitter.callAPI('GET', apiUrl, apiParams, function(status, responseText) {
					if(status == 200) {
						alert("登録しました。");
					}
				});
			}
		});
		dialog.show();
	};
	// 個々のTableViewRowを生成する
	TiTwitter.UI.createTableViewRow = function(tweet) {
		var row = Titanium.UI.createTableViewRow();
		row.height = 180;
		row.add(Titanium.UI.createLabel({
			text: tweet.user.screen_name,
			top: 8,
			left: 64,
			height: 16
		}));
		row.add(Titanium.UI.createLabel({
			text: tweet.text,
			top: 32,
			left: 64,
			width: 256,
			height: 'auto'
		}));
		row.add(Titanium.UI.createImageView({
			image: tweet.user.profile_image_url,
			top:8,
			left:8,
			width:48,
			height:48
		}));
		row.tweet = tweet;
		row.addEventListener('click', function(e) {
			// 新しいWindowを生成し、現在のTabにぶら下げて表示
			var thisTweet = e.rowData.tweet;
			Titanium.UI.currentTab.open(
			TiTwitter.UI.createTweetWindow(thisTweet)
			);
		});
		return row;
	};
	// プラットフォーム依存部を場合分けで記述する
	TiTwitter.UI.setRefreshButton = function(callback) {
		// Android環境か否かの判定
		if(Titanium.Platform.osname === 'android') {
			var activity = Titanium.Android.currentActivity;
			if(activity) {
				activity.onCreateOptionsMenu = function(e) {
					var menu = e.menu;
					var menuItem = menu.add({
						title: "再読込"
					});
					menuItem.setIcon("dark_refresh.png");
					menuItem.addEventListener("click", function(e) {
						callback();
					});
				};
			}
		} else {
			// (iOS) ウィンドウの右上のボタンを設定します
			var rightButton = Titanium.UI.createButton({
				systemButton: Titanium.UI.iPhone.SystemButton.REFRESH
			});
			Titanium.UI.currentWindow.rightNavButton = rightButton;
			rightButton.addEventListener('click', function() {
				callback();
			});
		}
	};
	// TwitterAPIを非同期で呼び出す
	TiTwitter.callAPI = function(method, url, params, callbackOnLoad) {
		// ネットワークが使用できないときはエラーメッセージを表示する
		if(Titanium.Network.online == false) {
			// エラー表示
			alert('オフラインなのでデータを取得できません。');
			return;
		}
		// HTTPClientオブジェクトを生成します。
		var xhr = Titanium.Network.createHTTPClient();
		xhr.open(method, url, false);
		// レスポンスを受け取るイベント(非同期に実行される)
		xhr.onload = function() {
			callbackOnLoad(xhr.status, xhr.responseText);
		};
		// エラー発生時のイベント
		xhr.onerror = function(error) {
			// errorにはエラー事由の文字列オブジェクトが入ってくる。
			alert(error);
		};
		// リクエスト送信します。
		if(params) {
			xhr.send(params);
		} else {
			xhr.send();
		}
	};
	// ユーザタイムラインを取得する。
	TiTwitter.loadUserTimeline = function(screenName) {
		var url = 'http://api.twitter.com/1/statuses/user_timeline.json?screen_name=' + screenName;
		TiTwitter.callAPI('GET', url, null, function(status, responseText) {
			// データをクリア
			TiTwitter.UI.tableView.data = [];
			// 受け取ったJSONデータをパース
			var json = JSON.parse(responseText);
			for(var i = 0; i< json.length; i++) {
				TiTwitter.UI.tableView.appendRow(TiTwitter.UI.createTableViewRow(json[i]));
			}
		});
	};
	// 検索結果を取得する。
	TiTwitter.loadSearchResult = function(queryString) {
		var url = 'http://search.twitter.com/search.json';
		TiTwitter.callAPI('GET', url, {
			q: queryString
		}, function(status, responseText) {
			// データをクリア
			TiTwitter.UI.tableView.data = [];
			// 受け取ったJSONデータをパース
			var json = JSON.parse(responseText);
			for(var i = 0; i< json.results.length; i++) {
				// レイアウトの違いを吸収
				var tweet = json.results[i];
				tweet.user = {};
				tweet.user.screen_name = tweet.from_user;
				tweet.user.name = tweet.from_user;
				tweet.user.profile_image_url = tweet.profile_image_url;
				TiTwitter.UI.tableView.appendRow(TiTwitter.UI.createTableViewRow(tweet));
			}
		});
	};
})();