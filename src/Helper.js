Array.prototype.clear=function() {
    this.length=0;
};

Array.prototype.insertAt=function(index,obj){
    this.splice(index,0,obj);
};

Array.prototype.removeAt=function(index){
    this.splice(index,1);
};

Array.prototype.remove=function(obj){
    var index=this.indexOf(obj);
    if (index>=0){
        this.removeAt(index);
    }
};

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
};

String.prototype.format = function() {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{'+i+'\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

String.prototype.beginsWith = function (string) {
    return (this.substring(0, string.length) == string)
    //return(this.indexOf(string) === 0);
};

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    } return size;
};

function ObjToSource(o) {
    if (!o) return 'null';
    if (typeof(o) == "object") {
        if (!ObjToSource.check) 
            ObjToSource.check = new Array();
        for (var i=0, k=ObjToSource.check.length ; i<k ; ++i) {
            if (ObjToSource.check[i] == o) {return '{}';}
        }
        ObjToSource.check.push(o);
    }
    var k="",na=typeof(o.length)=="undefined"?1:0,str="";
    for(var p in o){
        if (na) k = "'"+p+ "':";
        if (typeof o[p] == "string") 
            str += k + "'" + o[p]+"',";
        else if (typeof o[p] == "object") 
            continue;
            //str += k + ObjToSource(o[p])+",";
        else 
            str += k + o[p] + ",";
    }
    if (typeof(o) == "object") ObjToSource.check.pop();
    if (na) return "{"+str.slice(0,-1)+"}";
    else return "["+str.slice(0,-1)+"]";
};
function iterProperty (o, limit, res) {
	if (!o) return;
	if (!ObjToSource.level) 
		ObjToSource.level = 0;
	ObjToSource.level ++;
	if (ObjToSource.level > limit) {
		ObjToSource.level --;
		ObjToSource.check.pop();
		return;	
	}
	if (typeof(o) == "object") {
		if (!ObjToSource.check) 
            ObjToSource.check = new Array();
        for (var i = 0, k = ObjToSource.check.length; i < k; i++) {
            if (ObjToSource.check[i] == o) {
            	ObjToSource.level --;
            	return '{}';
            }
        }
        ObjToSource.check.push(o);
    }
    for(var p in o) {
        if (typeof o[p] == "object") {
        	var a = new Array();
        	a.name = p;
        	a.value = null;
        	a.level = ObjToSource.level;
        	res.push(a);
        	this.iterProperty(o[p], limit, res);
        }
        else if (typeof o[p] == "function") {
        	continue;
        }
        else {
        	var a = new Array();
        	a.name = p;
        	a.value = o[p];
        	a.level = ObjToSource.level;
        	res.push(a);
        }
    }
    if (typeof(o) == "object") { 
    	ObjToSource.level --;
    	ObjToSource.check.pop();
    }
};
function newFilledArray(length, val) {
    var array = [];
    for (var i = 0; i < length; i++) {
        array[i] = val;
    }
    return array;
};