function InputData()
{
	var entryList = [];
	var amountAttributes = 0;
	var amountClasses = 0;

	// name of the entries. For example, in the document 'treinamento.csv', the name of the entries is 'x1', 'x2', 'x3', 'x4' and 'x5'.
	var entryNameList = [];

	this.getEntryList = function()
	{
		return this.entryList;
	}
	this.setEntryList = function(entryList)
	{
		this.entryList = entryList;
	}

	this.getAmountAttributes = function()
	{
		return this.amountAttributes;
	}
	this.setAmountAttributes = function(amountAttributes)
	{
		this.amountAttributes = amountAttributes;
	}

	this.getAmountClasses = function()
	{
		return this.amountClasses;
	}
	this.setmountClasses = function(amountClasses)
	{
		this.amountClasses = amountClasses;
	}

	this.getEntryNameList = function()
	{
		return this.entryNameList;
	}
	this.setEntryNameList = function(entryNameList)
	{
		console.log(entryNameList);
		this.entryNameList = entryNameList;
	}
}

function Entry()
{
	var list = [];
	var className = "";

	this.getClassName = function()
	{
		return this.className;
	}
	this.setClassName = function(className)
	{
		this.className = className;
	}

	this.getList = function()
	{
		return this.list;
	}
	this.setList = function(list)
	{
		this.list = list;
	}
}

//var to identify the element selected
var _selected_element = null;
var _selected_for_input = null;
//BEGIN OF CLASSES
//Class Transition
//Requires two param
//pattern - the pattern to be used on transition
//next - the next state of automaton
var Transition = function(pattern, next)
{
	//Just one element like 'a' or '1'
	//TODO validate pattern to length 1
	if (pattern == '')
	{
		this.pattern = 'λ';
	}
	else{
		this.pattern = pattern;
	}

	this.pattern_rect = {'x':0, 'y':0, 'width':0, 'height':0};
	this.next = next;
	// VISUAL PROPERTIES
	// property used to determine if the line is straight=0, curve top=1, curve bottom=-1
  this.bridge = 0;
};

//Class State
//Don't need parammeters
var State = function(x, y, label)
{
	//Start without any transitions
	//w3 recommends avoid new Array()
	this.transitions = [];
	//All booleans will be false by default
	this.active = false;
	this.ini = false;
	this.end = false;
	// VISUAL PROPERTIES
	this.x = x;
  this.y = y;
  this.color = 'black';
  this.radius = 20;
  this.label = label;
};
