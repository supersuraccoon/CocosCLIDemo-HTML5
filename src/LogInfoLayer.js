// LogInfoLayer config

// LogInfoLayer
var LogInfoLayer = cc.LayerColor.extend({
	_delegate:null,
	_content:null,
	_scrolling:false,
    _lastPoint:null,
    ctor:function () {
        cc.associateWithNative( this, cc.LayerColor );
		this._super();
    },
    init:function (delegate, layerWidth, layerHeight, contentWidth, contentHeight) {
    	this._layerWidth = layerWidth; 
    	this._layerHeight = layerHeight; 
    	this._contentWidth = contentWidth;
    	this._contentHeight = contentHeight;
    	
    	cc.LayerColor.prototype.init.call(this, cc.c4b(100, 100, 100, 200), this._layerWidth, this._layerHeight);        

    	// enable touch
        this.setTouchEnabled(true);
    	
        // init args
    	this._delegate = delegate;
    	this._contentLabelArray = new Array();
    	
        this._contentLayer = cc.LayerColor.create(cc.c4b(0, 0, 0, 0), this._contentWidth, this._contentHeight);
        this._contentLayer.setPosition(cc.p(0, this._layerHeight - this._contentHeight));
        
        this._clipper = cc.ClippingNode.create();
        this._clipper.setContentSize(cc.size(this._layerWidth, this._layerHeight));
        this.addChild(this._clipper);

        var stencil = cc.DrawNode.create();
        var rectangle = [cc.p(0, 0),
                         cc.p(this._clipper.getContentSize().width, 0),
                         cc.p(this._clipper.getContentSize().width, this._clipper.getContentSize().height),
                         cc.p(0, this._clipper.getContentSize().height)];
        stencil.drawPoly(rectangle, 4, cc.c4f(1, 1, 1, 0), 1);
        this._clipper.setStencil(stencil);
        this._clipper.addChild(this._contentLayer);
        this.setTouchEnabled(true);
    	return true;
    },
    removeAllContent:function () {
    	for (var i = 0; i < this._contentLabelArray.length; i++) {
    		var contentLabel = this._contentLabelArray[i];
    		contentLabel.removeFromParent(true);
    	}
    },
    addString:function (content) {
    	this.removeAllContent();
        this._contentLayer.setPosition(cc.p(0, this._layerHeight - this._contentHeight));
    	var contentLabel = cc.LabelTTF.create(content, "Arial", 18);
		contentLabel.setAnchorPoint(cc.p(0, 0.5));
		contentLabel.setPosition(cc.p(10, 1000 - 30));
        this._contentLayer.addChild(contentLabel);
        this._contentLabelArray.push(contentLabel);
    },
    addDictObject:function (contentDict) {
    	this.removeAllContent();
        this._contentLayer.setPosition(cc.p(0, this._layerHeight - this._contentHeight));
    	var resultArray = new Array();
    	iterProperty(contentDict, 3, resultArray)
    	for (var i = 0 ; i < resultArray.length; i++) {
    		var a = resultArray[i];
    		var contentLabel = cc.LabelTTF.create(a.name + (a.value == null ? "" : " - " + a.value), "Arial", 18);
    		contentLabel.setAnchorPoint(cc.p(0, 0.5));
    		contentLabel.setPosition(cc.p(10 + a.level * 20, 1000 - 30 * (i + 1)));
            this._contentLayer.addChild(contentLabel);
            this._contentLabelArray.push(contentLabel);
    	}
    },
    onTouchesBegan:function (touches, event) {
        if(!touches || touches.length == 0)
            return;
        var point = this._clipper.convertToNodeSpace(touches[0].getLocation());
        var rect = cc.rect(0, 0, this._clipper.getContentSize().width, this._clipper.getContentSize().height);
        this._scrolling = cc.rectContainsPoint(rect, point);
        this._lastPoint = point;
    },
    onTouchesMoved:function (touches, event) {
        if (!this._scrolling || (!touches || touches.length == 0))
            return;
        var point = this._clipper.convertToNodeSpace(touches[0].getLocation());
        var diff = cc.pSub(point, this._lastPoint);
        diff.x = 0;
        this._contentLayer.setPosition(cc.pAdd(this._contentLayer.getPosition(), diff));
        this._lastPoint = point;
    },

    onTouchesEnded:function (touches, event) {
        if (!this._scrolling) return;
        this._scrolling = false;
    }
});

LogInfoLayer.createLogInfoLayer = function (delegate, layerWidth, layerHeight, contentWidth, contentHeight) {
    var logInfoLayer = new LogInfoLayer();
    if (logInfoLayer && logInfoLayer.init(delegate, layerWidth, layerHeight, contentWidth, contentHeight)) 
    	return logInfoLayer;
    return null;
};
