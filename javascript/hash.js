var c = document.getElementsByTagName('canvas')[0];
var ctx = c.getContext("2d");
var BLOCK_W = 400/16;
var BLOCK_H = 25;

// number of hash functions
var numHashFunctions = 3;

// filter size
var filterSize = 16;

// m bits
var m_bits = new Array(filterSize).fill(0);

// list of strings
var listOfStrings = [];

var FNVPRIME = 0x01000193;  
var FNVINIT = 0x811c9dc5; 

// Fowler/Noll/Vo hashing.
function fnv_1a(v) {
	var a = 2166136261;
	for (var i = 0, n = v.length; i < n; ++i) {
	  var c = v.charCodeAt(i),
		  d = c & 0xff00;
	  if (d) a = fnv_multiply(a ^ d >> 8);
	  a = fnv_multiply(a ^ c & 0xff);
	}
	return fnv_mix(a);
}
  
// a * 16777619 mod 2**32
function fnv_multiply(a) {
	return a + (a << 1) + (a << 4) + (a << 7) + (a << 8) + (a << 24);
}

function fnv_mix(a) {
	a += a << 13;
	a ^= a >>> 7;
	a += a << 3;
	a ^= a >>> 17;
	a += a << 5;
	return a & 0xffffffff;
}

function string2Bin(str) {
var result = [];
	for (var i = 0; i < str.length; i++) {
		result.push(str.charCodeAt(i));
	}
	return result;
}

function fnv_1a(s) {
    var h = FNVINIT

    for (var i = 0, l = s.length; i < l; i++) {
        h ^= s.charCodeAt(i)
        h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24)
    }

    return h >>> 0
}

// perform the hash function 'n' number of times
function nthHash(n, str) {
	return ((murmur(str) * n + fnv_1a(str)) % filterSize);
}

// insert string
function add() {
	var text = document.getElementById('text');
	var str = text.value;
	listOfStrings.push(str);
	for (var n = 0; n < numHashFunctions; n++) {
		m_bits[nthHash(n, str)] = 1;
	}
	
	var list = document.getElementById('list_set');
	var entry = document.createElement('li');
	entry.appendChild(document.createTextNode(str));
	list.appendChild(entry);
	text.value = "";
	
	draw(false);
}

// check if the string is potentially within the array
function potentiallyContains() {
	var bitList = [];
	var str = document.getElementById('text').value;
	for (var n = 0; n < numHashFunctions; n++) {
		var hashNum = nthHash(n, str);
		if (!(m_bits[hashNum])) {
			document.getElementById('found').innerHTML += "not found";
			return false;
		}
		bitList.push(hashNum);
	}
	draw(true, bitList);
	document.getElementById('found').innerHTML = "possibly found";
	return true;
}
			
function draw(check, bitList) {
	ctx.clearRect(0, 0, c.width, c.height);
	
	var j;
	var k = 0;
	var sortedList = []

	if (sortedList.length != 0) 
		sortedList = bitList.sort(function(a, b){return a-b});
	
	for ( var x = 0; x < filterSize; ++x ) {
		if (check && x == sortedList[k]) {
			console.log(x + " " + bitList + " " + k);
			k++;
			ctx.fillStyle = "rgba(126, 192, 238, 0.4)";
		} else {
			ctx.fillStyle = 'white'
		}
		ctx.font="12px monospace";
		ctx.strokeStyle = '#ADD8E6';
		ctx.lineWidth = "2";
		ctx.fillRect( BLOCK_W * x, BLOCK_H, BLOCK_W - 1 , BLOCK_H - 1 );
		ctx.strokeRect( BLOCK_W * x, BLOCK_H, BLOCK_W - 1 , BLOCK_H - 1 );
		ctx.fillStyle = '#7EC0EE'
		ctx.fillText(m_bits[x], (BLOCK_W * x) + (BLOCK_W)/2 - 3, BLOCK_H + (BLOCK_H)/2 + 3);	
	}

}

draw();