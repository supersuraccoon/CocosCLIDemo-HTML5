/*
    Author: 
    SuperSuRaccoon
    
    Date:   
    2013/8/5
    
    Name:   
    CLILayer
    
    Desc:   
    A inner command line layer for coocs2d project.
    What you can do with CLILayer:
    . Live Log output: 
      You can output log to CLILayer where you can check at run time (without IDE)
    . Live Obj Property Query: 
      You can use po command to print any object properties at run time
    . Live Cocos2d API editor: 
      You can use any cocos2d API at run time (ex: add sprite, run action, modify sprite property)
    . Live Logic Controller: 
      You can change hack into the game and change the game flow at run time (ex: cheater, add timer, etc)
    . Cross Platfrom:
      This script is 100% compatible with cocos2d(iphone/x) project (Using SpiderMonkey + JSBinding)
      
    Ex:
    . Live Log output: 
      Code Snippet: cliLayer.addLog("LogInfo", CLI_LOG_TYPE_INFO);
      Command Type: CLI_LOG_TYPE_INFO, CLI_LOG_TYPE_WARNNING, CLI_LOG_TYPE_ERROR, CLI_LOG_TYPE_COMMAND, CLI_LOG_TYPE_PO
    . Live Obj Property Query: 
      Code Snippet: po this.getPosition()
      Code Snippet: po this.getColor()
    . Live Cocos2d API editor: 
      Code Snippet: cc.Sprite.create("xxx.png"); this.addChild(this.co);
    . Live Logic Controller:
      Code Snippet: this.restartGame(); //restartGame is game logic function
    . Cross Platfrom:
      Check the cocos2d-x version project: https://github.com
*/

// constants
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
var CLI_EDITBOX_FONT_COLOR = cc.BLACK;

// tag
var CLI_INFO_TAG = 1;
var CLI_EDITBOX_TAG = 2;
var CLI_LOG_BASE_TAG = 100;

// log type
var CLI_LOG_TYPE_INFO = 1;
var CLI_LOG_TYPE_WARNNING = 2;
var CLI_LOG_TYPE_ERROR = 3;
var CLI_LOG_TYPE_COMMAND = 4;
var CLI_LOG_TYPE_PO = 5;

// log data
var LogInfoData = function () {
    this.orgString = "";
    this.showString = "";
    this.page = 0;
    this.tag = 0;
};
LogInfoData.create = function (orgString, showString, page, tag, logType) {
    var logInfoData = new LogInfoData();    
    logInfoData.orgString = orgString;
    logInfoData.showString = showString;
    logInfoData.page = page;
    logInfoData.tag = tag;
    logInfoData.logType = logType;
    return logInfoData;
};

// cli layer
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
        
        // cli object, store the last result of command (if not null)
        this.co = null;
        
        // member
        this.logArray = new Array();
        this.totalHeight = CLI_LOG_TOP_PADDING;
        this.curPage = 1;
        this.totalPage = 1;
        
        // component
        this._createCLIInfo();
        this._createCLIBox();
        this._createMenu();
        
		return true;	
	},
    // touch
    onTouchesBegan:function (touches, event) {
    },
    onTouchesMoved:function (touches, event) {
    },
    onTouchesEnded:function (touches, event) {
    },
    // mouse
    onMouseDown:function (event) {
        var loc = this.convertToNodeSpace(event.getLocation());
        var labelData = this._logDataFromTouch(loc);
        if (labelData) {
            cc.log(labelData.tag);
        }
    },
    // UI
    _createCLIInfo:function () {
        this._cliInfo = cc.LabelTTF.create("", CLI_FONT_NAME, CLI_FONT_SIZE);
        this._cliInfo.setPosition(cc.p(this.getContentSize().width * 1 / 3, this.getContentSize().height - 10));
        this.addChild(this._cliInfo, 1, CLI_INFO_TAG);
        this._updateCLIInfo();
    },
    _createCLIBox:function () {
        var cliBoxSprite = cc.Scale9Sprite.create(CLI_EDITBOX_SPRITE_NAME);
        this._CLIBox = cc.EditBox.create(cc.size(this.getContentSize().width, CLI_EDITBOX_HEIGHT), cliBoxSprite);
        this._CLIBox.setPlaceHolder("Input Command Here ~");
        this._CLIBox.setAnchorPoint(cc.p(0, 0));
        this._CLIBox.setDelegate(this);
        this._CLIBox.setFontColor(CLI_EDITBOX_FONT_COLOR);
        this.addChild(this._CLIBox, 1, CLI_EDITBOX_TAG);
    },
    _createMenu:function () {
        cc.MenuItemFont.setFontSize(CLI_FONT_SIZE);
        cc.MenuItemFont.setFontName(CLI_FONT_NAME);
        var leftArrow = cc.MenuItemFont.create("PRE", this._prePage, this);
        var rightArrow = cc.MenuItemFont.create("NEXT", this._nextPage, this);
        var clearLog = cc.MenuItemFont.create("CLEAR", this._clearLog, this);
        var menu = cc.Menu.create(leftArrow, clearLog, rightArrow);
        menu.setPosition(cc.p(this.getContentSize().width * 3 / 4, this.getContentSize().height - 10));
        menu.alignItemsHorizontallyWithPadding(20);
        this.addChild(menu);
    },
    // Info
    _updateCLIInfo:function () {
        this._cliInfo.setString("Log Count: " + this.logArray.length + " --- Page: " + this.curPage + "/" + this.totalPage);
    },
    // helper
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
        loc = this.convertToNodeSpace(loc);          
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
    // Control
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
    _executeCommand:function (command) {
        try  {
            // special command
            if (command.beginsWith("po ")) {
                eval("this.addLog(ObjToSource(" + command.substring(3) + "), 5)");
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
    // delegate
    editBoxEditingDidBegin: function (editBox) {},
    editBoxEditingDidEnd: function (editBox) {},
    editBoxTextChanged: function (editBox, text) {},
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
            this._executeCommand(logInfo);
    }
});

CLILayer.create = function (bgColor, width, height) {
    var cliLayer = new CLILayer();
    if (cliLayer && cliLayer.init(bgColor, width, height)) 
		return cliLayer;
    return null;
};

