/**
 * @class  UIFactory.NavigationWindow
 * @author  Flavio De Stefano <flavio.destefano@caffeinalab.com>
 *
 * Android implementations of `Ti.UI.iOS.NavigationWindow`
 *
 */

function NavigationWindow(args) {
	this.args = args || {};
	this.windows = [];
	this.window = args.window || null;
}

function __onWindowClose(nav, e) {
	var window = e.source;
	if (_.isNumber(window.navigationIndex)) {
		nav.windows.splice(window.navigationWindow, 1);
		nav.window = _.last(nav.windows);
	}
}

NavigationWindow.prototype.open = function(opt) {
	if (this.window == null) {
		Ti.API.error('UIFactory.NavigationWindow: no window defined in NavigationWindow');
		return false;
	}

	this.openWindow(this.window, opt);
};

NavigationWindow.prototype.close = function(callback) {
	var self = this;

	(function _close() {
		if (self.windows.length === 0) {
			if (_.isFunction(callback)) callback();
			return;
		}

		var w = self.windows.pop();
		w.removeEventListener('close', w.__onClose);
		w.addEventListener('close', _close);
		w.close({ animated: false });
	})();
};

NavigationWindow.prototype.openWindow = function(window, opt) {
	var self = this;
	opt = opt || {};

	window.navigationIndex = this.windows.length;
	window.__onClose = function(e) { __onWindowClose(self, e); };
	window.addEventListener('close', window.__onClose);

	this.windows.push(window);
	this.window = window;

	opt.modal = false; // set anyway to false to prevent heavyweight windows
	this.window.open(opt);
};

NavigationWindow.prototype.closeWindow = function(window) {
	window.close();
};

NavigationWindow.prototype.getWindowsStack = function() {
	return this.windows;
};

module.exports = NavigationWindow;