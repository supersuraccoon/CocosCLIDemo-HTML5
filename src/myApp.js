var Helloworld = cc.Layer.extend({
    init:function () {
        this._super();
        var size = cc.Director.getInstance().getWinSize();

		var titleLabel = cc.LabelTTF.create("Cocos2d CLILayer Demo", "Verdana", 32);
		titleLabel.setPosition(cc.p(size.width / 2, size.height * 12 / 13));
		this.addChild(titleLabel); 
      
        this.introString = 
                   "What you can do with CLILayer:" + 
                   "\n\n. Live Log output: " + 
                   "\n  You can output log to CLILayer where you can check at run time (without IDE)" +
                   
                   "\n\n. Live Obj Property Query: " +
                   "\n  You can use po command to print any object properties at run time" +
                   
                   "\n\n. Live Cocos2d API editor: " +
                   "\n  You can use any cocos2d API at run time (ex: add sprite, run action, modify sprite property)" +
                   
                   "\n\n. Live Logic Controller: " +
                   "\n  You can change hack into the game and change the game flow at run time (ex: cheater, add timer, etc)" +
                   
                   "\n\n. Cross Platfrom:" +
                   "\n  This script is 100% compatible with cocos2d(iphone/x) project (Using SpiderMonkey + JSBinding)" +
                   "";
                   
        this.sampleString = 
                   "What you can do with CLILayer:" + 
                   "\n\n. Live Log output: " + 
                   "\n  Code Snippet: cliLayer.addLog(\"LogInfo\", CLI_LOG_TYPE_INFO);" +
                   
                   "\n\n. Live Obj Property Query: " +
                   "\n  Code Snippet: po this.getPosition()" +
                   
                   "\n\n. Live Cocos2d API editor: " +
                   "\n  Code Snippet: cc.Sprite.create(\"xxx.png\"); this.addChild(this.co);" +
                   
                   "\n\n. Live Logic Controller: " +
                   "\n  Code Snippet: this.restartGame(); \/\/restartGame is game logic function" +
                   
                   "\n\n. Cross Platfrom:" +
                   "\n  Check the cocos2d-x version project: https://github.com" +
                   "";
                   
        this.moreString = 
                   "More About CLILayer" + 
                   "\n\n. Anything you type into the edit box will be treated as command automatically" + 
                   "\n. The command return value (if any) will the stored in: this.co (CLI Object)" +
                   "\n. \"this\" here refers to the \"CLILayer\" and that's the only object you can use directly" +
                   "\n. Basically, you need to use functions like \"getChildByTag\" to reach other objects" +
                   "\n  or you can pass the object to CLILayer from c++ (SpiderMonkey+JSB)" +
                   
                   "\n\n. Things to improve" +
                   "\n. Now the log info view only support single line" +
                   "\n. Now the command line edit box only support single line (not single command)" +
                   "\n. Unknown bugs for sure" +
                   
                   "\n\n. If you have any thoughts about this project, drop me a message at my site :)" +
                   "\n\n\n\n\n\n\n\n\n\n\n";
                   
		this.infoLabel = cc.LabelTTF.create(this.introString, "Verdana", 16);
		this.infoLabel.setAnchorPoint(cc.p(0, 1));
		this.infoLabel.setPosition(cc.p(size.width / 50, size.height * 6 / 13));
		this.addChild(this.infoLabel);
		
		this.cliLayer = CLILayer.create(700, 250);
		this.cliLayer.setPosition(cc.p((size.width - 700) / 2, (size.height - 250) / 2 + 100));
		this.addChild(this.cliLayer);
        
        cc.MenuItemFont.setFontSize(18);
        cc.MenuItemFont.setFontName("Verdana");
        var intro = cc.MenuItemFont.create("INTRO", this.showIntro, this);
        var sample = cc.MenuItemFont.create("SAMPLES", this.showSample, this);
        var more = cc.MenuItemFont.create("MORE", this.showMore, this);
        var video = cc.MenuItemFont.create("VIDEO", this.showVideo, this);
        var site = cc.MenuItemFont.create("SITE", this.showSite, this);
        intro.setColor(cc.YELLOW)
        sample.setColor(cc.YELLOW)
        more.setColor(cc.YELLOW)
        video.setColor(cc.YELLOW)
        site.setColor(cc.YELLOW)
        var menu = cc.Menu.create(intro, sample, more, video, site);
        menu.setPosition(cc.p(size.width * 3 / 4, size.height * 5 / 13));
        menu.alignItemsHorizontallyWithPadding(20);
        this.addChild(menu);
        
	    return true;
    },
    showIntro:function(sender) {
		this.cliLayer.addLog("Intro pressed", CLI_LOG_TYPE_INFO);
        this.infoLabel.setString(this.introString);
    },
    showSample:function(sender) {
		this.cliLayer.addLog("Sample pressed", CLI_LOG_TYPE_WARNNING);
        this.infoLabel.setString(this.sampleString);
    },
    showMore:function(sender) {
		this.cliLayer.addLog("More pressed", CLI_LOG_TYPE_ERROR);
        this.infoLabel.setString(this.moreString);
    },
    showSite:function(sender) {
        window.open("http://www.supersuraccoon-cocos2d.com/2013/08/12/cocosclilayer-html5-on-github/", "supersuraccoon-cocos2d.com");
    },
    showVideo:function(sender) {
        alert("Coming Soon");
    },
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new Helloworld();
        layer.init();
        this.addChild(layer);
    }
});

