CocosCLILayer-HTML5
===================

A inner command line layer for cocos2d project.

What you can do with CLILayer:

.Live Log output:
 You can output log to CLILayer where you can check at run time (without IDE)

.Live Obj Property Query:

 You can use po command to print any object properties at run time

.Live Cocos2d API editor:

 You can use any cocos2d API at run time (ex: add sprite, run action, modify sprite property)

.Live Logic Controller:

 You can change hack into the game and change the game flow at run time (ex: cheater, add timer, etc)

.Cross Platform:
 This script is 100% compatible with cocos2d(iphone/x) project (Using SpiderMonkey + JSBinding)


Samples:

.Live Log output:
 Code Snippet:
 cliLayer.addLog("LogInfo", CLI_LOG_TYPE_INFO);
 
 Command Type:
 CLI_LOG_TYPE_INFO,
 CLI_LOG_TYPE_WARNNING,
 CLI_LOG_TYPE_ERROR,
 CLI_LOG_TYPE_COMMAND,
 CLI_LOG_TYPE_PO

.Live Obj Property Query:
 Code Snippet:
 po this.getPosition()
 
 Code Snippet:
 po this.getColor()

.Live Cocos2d API editor:
 Code Snippet:
 cc.Sprite.create("xxx.png"); this.addChild(this.co);

.Live Logic Controller:
 Code Snippet:
 this.restartGame(); //restartGame is game logic function

.Cross Platform:
 Check the cocos2d-x version project:
 Coming Soon
 
 Check the cocos2d-iphone version project:
 Coming Soon

More:
.Anything you type into the edit box will be treated as command automatically
.The command return value (if any) will the stored in: this.co (CLI Object)
."this" here refers to the "CLILayer" and that's the only object you can use directly
.Basically, you need to use functions like "getChildByTag" to reach other objects or you can pass the object to CLILayer from c++ (SpiderMonkey+JSB)

Things to improve:
.Now the log info view only support single line
.Now the command line edit box only support single line (not single command)
.Unknown bugs for sure


If you have any thoughts about this project, drop me a message at my site :)
