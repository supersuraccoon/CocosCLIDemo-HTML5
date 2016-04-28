CocosCLILayer-HTML5
===================

A inner command line layer for cocos2d project.

[A live demo is here.](http://supersuraccoon.github.io/CocosCLIDemo-HTML5/)

UPDATE:

2013.8.17
. Add po command (similar to po in xcode)

2013.8.27
. Add a log info layer (using clippingnode) to show po result in a "tree format"
. Add key event (arrow up / arrow down / enter) for quick command browser and command execute  

2013.8.29
. Add a log info layer for listing members
. Add a log info layer for listing object functions
. Add po "cocos2d class" support for listing class members and functions
   

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


Attension:

.Anything you type into the edit box will be treated as command automatically

.The command return value (if any) will the stored in: this.co (CLI Object)

."this" here refers to the "CLILayer" and that's the only object you can use directly

.Basically, you need to use functions like "getChildByTag" to reach other objects or you can pass the object to CLILayer from c++ (SpiderMonkey+JSB)

Things to improve:

.Now the log info view only support single line

.Now the command line edit box only support single line (not single command)

.Unknown bugs for sure

