/**
*    Author: 
*    SuperSuRaccoon  -- 2013/8/5
*    
*    Desc:   
*    A inner command line layer for coocs2d project.
*    What you can do with CLILayer:
*    . Live Log output: 
*    . Live Obj Property Query: 
*    . Live Cocos2d API editor: 
*    . Live Logic Controller: 
*    . Cross Platfrom:
**/

/**
	Constants for CLILayer 
*/
var CLI_FONT_NAME = "Verdana";
var CLI_FONT_SIZE = 18;
var CLI_LAYER_COLOR = cc.c4b(19, 19, 19, 200);

var CLI_LOG_TOP_PADDING = 20;
var CLI_LOG_BOTTOM_PADDING = 80;
var CLI_LOG_LEFT_PADDING = 10;

var CLI_LOG_CHAR_LIMIT = 70;
var CLI_LOG_LINE_SPACE = 5;

var CLI_EDITBOX_SPRITE_NAME = "res/EditBox.png";
var CLI_EDITBOX_HEIGHT = 30;
var CLI_EDITBOX_LEFT_PADDING = 30;
var CLI_EDITBOX_FONT_COLOR = cc.BLACK;

var CLI_POPUP_MENU_HEIGHT = 50;

var CLI_INFO_TAG = 1;
var CLI_EDITBOX_TAG = 2;
var CLI_LOG_BASE_TAG = 100;

var CLI_LOG_TYPE_INFO = 1;
var CLI_LOG_TYPE_WARNNING = 2;
var CLI_LOG_TYPE_ERROR = 3;
var CLI_LOG_TYPE_COMMAND = 4;
var CLI_LOG_TYPE_PO = 5;

var CLI_COMMAND_HISTORY_LENGTH = 10;

/**
	Log data 
*/
var LogInfoData = function () {
    this.orgString = "";
    this.showString = "";
    this.page = 0;
    this.tag = 0;
    this.commandResult = null;
    this.poaResultDict = null;
    this.pofResultDict = null;
};
LogInfoData.create = function (orgString, showString, page, tag, logType) {
    var logInfoData = new LogInfoData();    
    logInfoData.orgString = orgString;
    logInfoData.showString = showString;
    logInfoData.page = page;
    logInfoData.tag = tag;
    logInfoData.logType = logType;
    logInfoData.commandResult = new Array();
    return logInfoData;
};

/**
	CLILayer main class 
*/
var CLILayer = cc.LayerColor.extend({
    ctor:function () {
        cc.associateWithNative( this, cc.LayerColor );
		this._super();
    },	
	init:function (width, height) {
    	cc.LayerColor.prototype.init.call(this, CLI_LAYER_COLOR, width, height);        
        
    	// touch
        if( 'mouse' in sys.capabilities )
            this.setMouseEnabled(true);
        if( 'touches' in sys.capabilities )
            this.setTouchEnabled(true);
        if( 'keyboard' in sys.capabilities )
            this.setKeyboardEnabled(true);
        
        // cli object, store the last result of command (if not null)
        this.co = null;
        
        // member
        this.logArray = new Array();
        this.commandHistoryArray = new Array();
        this.commandHistoryIndex = 0;
        this.totalHeight = CLI_LOG_TOP_PADDING;
        this.curPage = 1;
        this.totalPage = 1;
        
        // component
        cc.MenuItemFont.setFontSize(CLI_FONT_SIZE);
        cc.MenuItemFont.setFontName(CLI_FONT_NAME);
    	
        this._createFrame();
        this._createCLIInfo();
        this._createCLIBox();
        this._createLogMenu();
        this._createCLIMenu();
        this._createPopupMenu();
        this._createPoaLogLayer();
        this._createPofLogLayer();
        
		return true;	
	},
	// cli menu
	_showPopupMenu:function () {
		if (this._isPopupMenuShowing) {
			this._isPopupMenuShowing = false
			this._popupMenuLayer.runAction(cc.ScaleTo.create(0.1, 0));
		}
		else {
			this._isPopupMenuShowing = true;
			this._popupMenuLayer.runAction(cc.ScaleTo.create(0.1, 1.0));
		}
	},
	_showPoaLogLayer:function () {
		if (this._isPoaLogLayerShowing) {
			this._isPoaLogLayerShowing = false
			this._poaLogInfoLayer.runAction(cc.ScaleTo.create(0.1, 0));
		}
		else {
			this._isPoaLogLayerShowing = true;
			this._poaLogInfoLayer.runAction(cc.ScaleTo.create(0.1, 1.0));
		}
	},
	_showPofLogLayer:function () {
		if (this._isPofLogLayerShowing) {
			this._isPofLogLayerShowing = false
			this._pofLogInfoLayer.runAction(cc.ScaleTo.create(0.1, 0));
		}
		else {
			this._isPofLogLayerShowing = true;
			this._pofLogInfoLayer.runAction(cc.ScaleTo.create(0.1, 1.0));
		}
	},
	// Interact - mouse, touch, keyboard
	_handleTouch:function (location) {
//		if (this._isPoaLogLayerShowing)
//    		return;
        var labelData = this._logDataFromTouch(location);
        if (labelData) {
            // show detail log
            if (labelData.logType == CLI_LOG_TYPE_COMMAND && labelData.commandResult != null) {
            	this._poaLogInfoLayer.addDictObject(labelData.poaResultDict);
            	this._pofLogInfoLayer.addDictObject(labelData.pofResultDict);
            	return;
            }
        }
	},
	// touch
    onTouchesBegan:function (touches, event) {
		this._handleTouch(this.convertToNodeSpace(touches[0]));
	},
    onTouchesMoved:function (touches, event) {
    },
    onTouchesEnded:function (touches, event) {
    },
    // mouse
    onMouseDown:function (event) {
    	this._handleTouch(this.convertToNodeSpace(event.getLocation()));
    },
    // keyboard
    onKeyUp:function(key) {
    	// up
    	if (key == 38) {
    		if (this.commandHistoryIndex + 1 > this.commandHistoryArray.length - 1)
    			this.commandHistoryIndex = 0;
    		else
    			this.commandHistoryIndex ++;
    		this._CLIBox.setText(this.commandHistoryArray[this.commandHistoryIndex]);
    	}
    	// down
    	if (key == 40) {
    		if (this.commandHistoryIndex - 1  < 0)
    			this.commandHistoryIndex = this.commandHistoryArray.length - 1;
    		else
    			this.commandHistoryIndex --;
    		this._CLIBox.setText(this.commandHistoryArray[this.commandHistoryIndex]);
    	}
    	// enter
    	if (key == 13) {
            var command = this._CLIBox.getText();
            this.addLog(command, CLI_LOG_TYPE_COMMAND);
            this._CLIBox.setText("");
    	}
    },
    onKeyDown:function(key) {
    },
 	// UI - create, update component
    _createPoaLogLayer:function () {
    	this._isPoaLogLayerShowing = false;
    	var width = this.getContentSize().width / 2;
    	var height = this.getContentSize().height;
    	this._poaLogInfoLayer = LogInfoLayer.createLogInfoLayer(this, width, height, width, 1000);
    	this._poaLogInfoLayer.setScale(0);
        this.addChild(this._poaLogInfoLayer, 999);
    },
    _createPofLogLayer:function () {
    	this._isPofLogLayerShowing = false;
    	var width = this.getContentSize().width / 2;
    	var height = this.getContentSize().height;
    	this._pofLogInfoLayer = LogInfoLayer.createLogInfoLayer(this, width, height, width, 1000);
    	this._pofLogInfoLayer.setPosition(cc.p(width, 0));
    	this._pofLogInfoLayer.setScale(0);
        this.addChild(this._pofLogInfoLayer, 999);
    },
    _createFrame:function() {
    	var rectangle = [cc.p(0, 0),
                         cc.p(this.getContentSize().width, 0),
                         cc.p(this.getContentSize().width, this.getContentSize().height),
                         cc.p(0, this.getContentSize().height)];
        var frameSprite = FrameSprite.create(rectangle, 2);
        frameSprite.setColor(cc.WHITE);
        this.addChild(frameSprite);
    },
    _createCLIInfo:function () {
        this._cliInfo = cc.LabelTTF.create("", CLI_FONT_NAME, CLI_FONT_SIZE);
        this._cliInfo.setPosition(cc.p(this.getContentSize().width * 1 / 3, this.getContentSize().height - 10));
        this.addChild(this._cliInfo, 1, CLI_INFO_TAG);
        this._updateCLIInfo();
    },
    _createCLIBox:function () {
        var cliBoxSprite = cc.Scale9Sprite.create(CLI_EDITBOX_SPRITE_NAME);
        this._CLIBox = cc.EditBox.create(cc.size(this.getContentSize().width - CLI_EDITBOX_LEFT_PADDING, CLI_EDITBOX_HEIGHT), cliBoxSprite);
        this._CLIBox.setPosition(cc.p(CLI_EDITBOX_LEFT_PADDING, 0));
        this._CLIBox.setPlaceHolder("Input Command Here ~");
        this._CLIBox.setAnchorPoint(cc.p(0, 0));
        this._CLIBox.setDelegate(this);
        this._CLIBox.setFontColor(CLI_EDITBOX_FONT_COLOR);
        this.addChild(this._CLIBox, 1, CLI_EDITBOX_TAG);
    },
    _createLogMenu:function () {
        var leftArrow = cc.MenuItemFont.create("PRE", this._prePage, this);
        var rightArrow = cc.MenuItemFont.create("NEXT", this._nextPage, this);
        var clearLog = cc.MenuItemFont.create("CLEAR", this._clearLog, this);
        var menu = cc.Menu.create(leftArrow, clearLog, rightArrow);
        menu.setPosition(cc.p(this.getContentSize().width * 3 / 4, this.getContentSize().height - 10));
        menu.alignItemsHorizontallyWithPadding(20);
        this.addChild(menu);
    },
    _createCLIMenu:function () {
    	var entranceMenuItem = cc.MenuItemFont.create("O", this._showPopupMenu, this);
    	entranceMenuItem.setAnchorPoint(cc.p(0.5, 0));
        var menu = cc.Menu.create(entranceMenuItem);
        menu.setPosition(cc.p(CLI_EDITBOX_LEFT_PADDING / 2, 5));
        this.addChild(menu);
    },
    _createPopupMenu:function () {
    	this._popupMenuLayer = cc.LayerColor.create(cc.c4b(0, 0, 0, 10), CLI_EDITBOX_LEFT_PADDING, CLI_POPUP_MENU_HEIGHT);
    	this._popupMenuLayer.setPosition(cc.p(0, CLI_EDITBOX_HEIGHT));
    	this._popupMenuLayer.setScale(0);
    	this._isPopupMenuShowing = false;
    	this.addChild(this._popupMenuLayer, 999, 999);
    	var menuItem1 = cc.MenuItemFont.create("P", this._showPoaLogLayer, this);
    	var menuItem2 = cc.MenuItemFont.create("F", this._showPofLogLayer, this);
        var menu = cc.Menu.create(menuItem1, menuItem2);
        menu.alignItemsVerticallyWithPadding(5);
        menu.setPosition(cc.p(CLI_EDITBOX_LEFT_PADDING / 2, CLI_POPUP_MENU_HEIGHT / 2));
        this._popupMenuLayer.addChild(menu);
    },
    _updateCLIInfo:function () {
        this._cliInfo.setString("Log Count: " + this.logArray.length + " --- Page: " + this.curPage + "/" + this.totalPage);
    },
    _updateLogPosition:function (logData) {
        var label = cc.LabelTTF.create(logData.showString, CLI_FONT_NAME, CLI_FONT_SIZE);
        label.setAnchorPoint(cc.p(0, 0.5));
        label.setColor(this._colorForLogType(logData.logType));
        if (this.totalHeight + CLI_LOG_BOTTOM_PADDING > this.getContentSize().height) {
            this.totalHeight = CLI_LOG_TOP_PADDING;
            this._clearLogForPage(this.curPage);
            this.curPage ++;
            this.totalPage ++;
            logData.page ++;
        }
		// label._fontClientHeight
        this.totalHeight += 20 + CLI_LOG_LINE_SPACE;
        label.setPosition(cc.p(CLI_LOG_LEFT_PADDING, this.getContentSize().height - this.totalHeight));
        this.addChild(label, 1, logData.tag);
        this._updateCLIInfo();
    },    
	// Helper
    _makeLogString:function(logInfo) {
        var hasLineBreak = false;
        if (logInfo.indexOf("\n") != -1) {
            hasLineBreak = true;
            logInfo = logInfo.slice(0, logInfo.indexOf("\n"));
        }
        if (logInfo.length > CLI_LOG_CHAR_LIMIT) {
            return logInfo.slice(0, CLI_LOG_CHAR_LIMIT) + "......";
        }
        else {
            return hasLineBreak ? logInfo + "......" : logInfo;
        }
    },
    _logDataFromTouch:function(loc) {          
        for (var i in this.logArray) {
            var logData = this.logArray[i];
            if (logData.page == this.curPage) {
                var labelTTF = this.getChildByTag(logData.tag);
                if(cc.rectContainsPoint(labelTTF.getBoundingBox(), loc)) {
                    return logData;
                }
            }
        }
        return null;
    },
    _clearLogForPage:function(page) {
        for (var i in this.logArray) {
            var logData = this.logArray[i];
            if (logData.page == this.curPage) {
                this.removeChildByTag(logData.tag, true);
            }
        }
    },
    _moveToPage:function(page) {
        if (page == this.curPage) return;
        if (page > this.totalPage || page < 1) return;
        this._clearLogForPage(this.curPage);
        this.totalHeight = CLI_LOG_TOP_PADDING;
        // add lavelTTF for newPage
        for (var i in this.logArray) {
            var logData = this.logArray[i];
            if (logData.page == page) {
                this._updateLogPosition(logData);
            }
        }
        this.curPage = page;
        this._updateCLIInfo();
    },
    _executeCommand:function (logData) {
    	var command = logData.orgString;
    	this.commandHistoryArray.push(command);
        try  {
            // special command
            if (command.beginsWith("po ")) {
            	if (command.beginsWith("po cc.")) {
            		logData.commandResult = eval(command.substring(3) + ".prototype");
                    eval("this.addLog(ObjToSource(" + command.substring(3) + ".prototype" + "), 5)");
                    // parse result
                    logData.poaResultDict = new Array();
                    logData.pofResultDict = new Array();
                    ExtractObject(logData.commandResult, 1, logData.poaResultDict, 2);
                    ExtractObject(logData.commandResult, 1, logData.pofResultDict, 1);
            	}
            	else {
            		logData.commandResult = eval(command.substring(3));
                    eval("this.addLog(ObjToSource(" + command.substring(3) + "), 5)");
                    // parse result
                    logData.poaResultDict = new Array();
                    logData.pofResultDict = new Array();
                    ExtractObject(logData.commandResult, 2, logData.poaResultDict, 2);
                    ExtractObject(logData.commandResult, 1, logData.pofResultDict, 1);	
            	}
            	this._poaLogInfoLayer.addDictObject(logData.poaResultDict);
            	this._pofLogInfoLayer.addDictObject(logData.pofResultDict);
            }
            else {
                var ret = eval(command);
                if (ret)
                    this.co = ret;
            }
        }
        catch(exception) {
            this.addLog(exception.message, CLI_LOG_TYPE_ERROR);
        }
    },
    _logTimeStamp:function () {
        var d = new Date(new Date().getTime());
        var hour = d.getHours();
        var minute = d.getMinutes();
        var second = d.getSeconds();
        return "[" + (hour > 9 ? hour : "0" + hour ) + ":" + (minute > 9 ? minute : "0" + minute ) + ":" + (second > 9 ? second : "0" + second ) + "]"
    },
    _colorForLogType:function (logType) {
        if (logType == CLI_LOG_TYPE_INFO) return cc.WHITE;
        if (logType == CLI_LOG_TYPE_WARNNING) return cc.YELLOW;
        if (logType == CLI_LOG_TYPE_ERROR) return cc.RED;
        if (logType == CLI_LOG_TYPE_COMMAND) return cc.GREEN;
        if (logType == CLI_LOG_TYPE_PO) return cc.ORANGE;
        return cc.BLACK;
    },
    _prefixForLogType:function (logType) {
        if (logType == CLI_LOG_TYPE_INFO) return "[I]";
        if (logType == CLI_LOG_TYPE_WARNNING) return "[W]";
        if (logType == CLI_LOG_TYPE_ERROR) return "[E]";
        if (logType == CLI_LOG_TYPE_COMMAND) return "[C]";
        if (logType == CLI_LOG_TYPE_PO) return "[P]";
        return "[X]";
    },
    
    // menu
    _prePage:function () {
        this._moveToPage(this.curPage - 1);
    },
    _nextPage:function () {
        this._moveToPage(this.curPage + 1);
    },
    _clearLog:function () {
        this._clearLogForPage(this.curPage);
        this.curPage = 1;
        this.totalPage = 1;
        this.logArray.length = 0;
        this.totalHeight = CLI_LOG_TOP_PADDING;
        this._updateCLIInfo();
    },
    // edit box delegate
    editBoxEditingDidBegin: function (editBox) {
    	if (this._isPoaLogLayerShowing)
    		this._poaLogInfoLayer.updateOpacity(50);
    	if (this._isPofLogLayerShowing)
    		this._pofLogInfoLayer.updateOpacity(50);
    },
    editBoxEditingDidEnd: function (editBox) {
    	if (this._isPoaLogLayerShowing)
    		this._poaLogInfoLayer.updateOpacity(150);
    	if (this._isPofLogLayerShowing)
    		this._pofLogInfoLayer.updateOpacity(150);
    },
    editBoxTextChanged: function (editBox, text) {
    },
    editBoxReturn: function (editBox) {
        var command = this._CLIBox.getText();
        this.addLog(command, CLI_LOG_TYPE_COMMAND);
        this._CLIBox.setText("");
    },
    // interface
    addLog:function (logInfo, logType) {
        if (logInfo == "Input Command Here ~") return;
        var logString = this._logTimeStamp() + this._prefixForLogType(logType) + " " + logInfo;
        var showString = this._makeLogString(logString);
        var logData = LogInfoData.create(logInfo, showString, this.curPage, this.logArray.length + 1 + CLI_LOG_BASE_TAG, logType);
        this.logArray.push(logData);
        this._updateLogPosition(logData);
        if (logType == CLI_LOG_TYPE_COMMAND)
            this._executeCommand(logData);
    }
});

CLILayer.create = function (bgColor, width, height) {
    var cliLayer = new CLILayer();
    if (cliLayer && cliLayer.init(bgColor, width, height)) 
		return cliLayer;
    return null;
};

