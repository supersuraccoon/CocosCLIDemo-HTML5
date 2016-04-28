// ShapeSprite.js

// DotSprite
var DotSprite = cc.Sprite.extend({
    init:function (dotWidth, dotSize, dotSegments) {
		if (this._super()) {
			this._dotSize = dotSize;
            this._dotWidth = dotWidth;
            this._dotSegments = dotSegments;
            this._dotColor = cc.WHITE;
            var draw = cc.DrawNode.create();
            this.addChild(draw, 99, 99);
            draw.drawDot(this.getPosition(), this._dotWidth, cc.c4f(1, 0, 0, 1));
		    bRet = true;
		}
		return bRet;
    },
    rect:function () {
        return new cc.rect(this.getPositionX() - this._dotWidth / 2, this.getPositionY() - this._dotWidth / 2, this._dotWidth, this._dotWidth);
    },
    setColor:function (color) {
    	this._dotColor = color;
        var draw = this.getChildByTag(99);
        draw.drawDot(this.getPosition(), this._dotWidth, cc.c4f(color.r / 255.0, color.g / 255.0, color.b / 255.0, 1));
    },
    getColor:function () {
    	return this._dotColor;
    }
});

DotSprite.create = function (dotWidth, dotSize, dotSegments) {
    var dot = new DotSprite();
    if (dot && dot.init(dotWidth, dotSize, dotSegments)) 
    	return dot;
    return null;
};

//LineSprite
var LineSprite = cc.Sprite.extend({
    init:function (lineWidth, startPosition, endPosition) {
		if (this._super()) {
			this._lineWidth = lineWidth;
			this._lineColor = cc.WHITE;
			this._startPosition = startPosition;
			this._endPosition = endPosition;

            var draw = cc.DrawNode.create();
            this.addChild(draw, 99, 99);
            draw.drawSegment(this._startPosition, this._endPosition, this._lineWidth, cc.c4f(1, 0, 0, 1));
		    bRet = true;
		}
		return bRet;
    },
    setColor:function (color) {
    	this._lineColor = color;
        var draw = this.getChildByTag(99);
        draw.drawSegment(this._startPosition, this._endPosition, this._lineWidth, cc.c4f(color.r / 255.0, color.g / 255.0, color.b / 255.0, 1));
    },
    getColor:function () {
    	return this.lineColor;
    }
});
LineSprite.create = function (lineWidth, startPosition, endPosition) {
    var line = new LineSprite();
    if (line && line.init(lineWidth, startPosition, endPosition)) 
    	return line;
    return null;
};

//
var PolygonSprite = cc.Sprite.extend({
    init:function (sides, radius) {
		if (this._super()) {
			this._sides = sides;
			this._radius = radius;
			this.polygonColor = cc.WHITE;
			
            var draw = cc.DrawNode.create();
            this.addChild(draw, 99, 99);
            draw.drawPoly(this._getPolygonVertArray(), cc.c4f(1, 0, 0, 1), 0, cc.c4f(0, 0, 0, 0));
		    bRet = true;
		}
		return bRet;
    },
    setColor:function(color) {
    	this.polygonColor = color;
        var draw = this.getChildByTag(99);
        draw.drawPoly(this._getPolygonVertArray(), cc.c4f(color.r / 255.0, color.g / 255.0, color.b / 255.0, 1), 0, cc.c4f(0, 0, 0, 0));
    },
    getColor:function () {
    	return this.polygonColor;
    },
    _getPolygonVertArray:function() {
    	var vertArray = new Array();
    	for (var i = 0; i < this._sides; i++) {
    		vertArray.push(cc.p(this._radius * Math.cos(i / this._sides * Math.PI * 2),
    							this._radius * Math.sin(i / this._sides * Math.PI * 2)));
    		
    	}
    	return vertArray;
    }
});
PolygonSprite.create = function (sides, radius) {
    var polygon = new PolygonSprite();
    if (polygon && polygon.init(sides, radius)) 
    	return polygon;
    return null;
};

// rect
var FrameSprite = cc.Sprite.extend({
    init:function (pointArray, width) {
		if (this._super()) {
			this._pointArray = pointArray;
			this._frameColor = cc.WHITE;
			this._frameWidth = width;
			
            var draw = cc.DrawNode.create();
            this.addChild(draw, 99, 99);
            draw.drawPoly(this._pointArray, cc.c4f(1, 0, 0, 0.01), this._frameWidth, cc.c4f(1, 0, 0, 1));
		    bRet = true;
		}
		return bRet;
    },
    setColor:function(color) {
    	this._frameColor = color;
        var draw = this.getChildByTag(99);
        draw.drawPoly(this._pointArray, cc.c4f(1, 0, 0, 0.01), this._frameWidth, cc.c4f(color.r / 255.0, color.g / 255.0, color.b / 255.0, 1));
    },
    getColor:function () {
    	return this._frameColor;
    }
});
FrameSprite.create = function (pointArray, width) {
    var frame = new FrameSprite();
    if (frame && frame.init(pointArray, width)) 
    	return frame;
    return null;
};
