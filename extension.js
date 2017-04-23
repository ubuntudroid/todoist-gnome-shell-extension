const St = imports.gi.St;
const Main = imports.ui.main;
const Soup = imports.gi.Soup;
const Lang = imports.lang;
const Mainloop = imports.mainloop;
const Clutter = imports.gi.Clutter;
const PanelMenu = imports.ui.panelMenu;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;

const URL = 'https://todoist.com/API/v7/sync';


let _httpSession;
let _syncToken;
let _openItems;
let _schema;

const TodoistIndicator = new Lang.Class({
		Name: 'Todoist.Indicator',
		Extends: PanelMenu.Button,

		_init: function () {
			this.parent(0.0, "Todoist Indicator", false);
			this.buttonText = new St.Label({
				text: _("Loading..."),
				y_align: Clutter.ActorAlign.CENTER
			});
			this.actor.add_actor(this.buttonText);
			this._refresh();
		},

		_refresh: function () {
			this._loadData(this._refreshUI);
			this._removeTimeout();
			this._timeout = Mainloop.timeout_add_seconds(60, Lang.bind(this, this._refresh));
			return true;
		},

		_loadData: function () {
			let token = _schema.get_string('api-token');
			let params = {
				token: token,
				sync_token: _syncToken,
				resource_types: '["items"]'
		    	}
			_httpSession = new Soup.Session();
			let message = Soup.form_request_new_from_hash('GET', URL, params);
			_httpSession.queue_message(message, Lang.bind(this, function (_httpSession, message) {
						if (message.status_code !== 200)
							return;
						let json = JSON.parse(message.response_body.data);
						this._refreshUI(json);
					}
				)
			);
		},

                _isDoneOrDeletedOrArchived: function (item) {
			return item.checked === 1 || item.is_deleted === 1 || item.is_archived;
		},

		_isNotDone: function (item) {
			return item.checked === 0;
		},

		_extractId: function (item) {
			return item.id;
		},

		_removeIfInList: function (item) {
			let index = _openItems.indexOf(item);
			if (index > -1)
				_openItems.splice(index, 1);
		},

		_addIfNotInList: function (item) {
			let index = _openItems.indexOf(item);
			if (index === -1)
				_openItems.splice(_openItems.length, 0, item);
		},

		_refreshUI: function (data) {
			_syncToken = data.sync_token;
			let undoneItems = data.items.filter(this._isNotDone).map(this._extractId);
			let doneItems = data.items.filter(this._isDoneOrDeletedOrArchived).map(this._extractId);
			undoneItems.forEach(this._addIfNotInList);
			doneItems.forEach(this._removeIfInList);
			let count = _openItems.length;
			this.buttonText.set_text(count + " open tasks");
		},

		_removeTimeout: function () {
			if (this._timeout) {
				Mainloop.source_remove(this._timeout);
				this._timeout = null;
			}
		},

		stop: function () {
			if (_httpSession !== undefined)
				_httpSession.abort();
			_httpSession = undefined;

			if (this._timeout)
				Mainloop.source_remove(this._timeout);
			this._timeout = undefined;

			this.menu.removeAll();
		}
	}
);

let todoistMenu;

function init() {
	_syncToken = '*';
	_openItems = [];
	_schema = Convenience.getSettings();
}

function enable() {
	todoistMenu = new TodoistIndicator;
	Main.panel.addToStatusArea('todoist-indicator', todoistMenu);
}

function disable() {
	todoistMenu.stop();
	todoistMenu.destroy();
}
