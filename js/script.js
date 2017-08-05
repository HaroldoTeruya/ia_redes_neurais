/*
 * Created 20.07.2017 at 17:45 by Haroldo Shigueaki Teruya.
 *
 * v1.4.
 * Require: JQuery and DataBase.js.
 *
 * This file is responsible to:
 * - control the interface.
 * - load and parse file.
 * - display and avail all the necessary data to train and test.
 */

// =====================================================================================================================
// EVENTS ==============================================================================================================
// =====================================================================================================================

/*
 * Event triggers when the "Escolher arquivo" is clicked.
 * Invoke 'readFile' function.
 */
document.getElementById('file-input').addEventListener('change', readFile, false);

/*
 * Event triggers when the "Escolher arquivo" is clicked.
 * Invoke 'readFileTest' function.
 */
document.getElementById('file-test').addEventListener('change', readFileTest, false);

/*
 * Event triggers when the "+" is clicked.
 * Invoke 'addHNodeidden' function.
 */
document.getElementById('add-hidden-node-button').addEventListener('click', addHiddenNode);

// =====================================================================================================================
// GLOBAL VARIABLES ====================================================================================================
// =====================================================================================================================

var _allEntryList = null;
var _testData = null;

// =====================================================================================================================
// FUNCTIONS ===========================================================================================================
// =====================================================================================================================

function readFile(e)
{
  var file = e.target.files[0];
  if (!file)
  {
    return;
  }
  var reader = new FileReader();
  var inputData = null;
  reader.onload = function(e)
  {
    var contents = e.target.result;
    var element = null;
    inputData = parse(contents);
    _allEntryList = inputData;

    $('#entry-list').html('');
    $('#hidden-layer-list').html('');

    element = document.getElementById('file-configuration');
    $(element).html('');
    element.textContent = "Amount of atributes: " + inputData.getAmountAttributes() + "\n" + "Amount of classes: " + inputData.getAmountClasses();

    element = document.getElementById('file-content');
    $(element).html('');
    element.textContent = contents;

    for( var i = 0; i < inputData.getEntryNameList().length; i++ )
    {
      addEntry(inputData.getEntryNameList()[i]);
      addOutputNode(i+1);
    }
  };
  reader.readAsText(file);
}

function readFileTest(e)
{
  var file = e.target.files[0];
  if (!file)
  {
    return;
  }
  var reader = new FileReader();
  var outputData = null;
  reader.onload = function(e)
  {
    var contents = e.target.result;
    var element = null;
    outputData = parse(contents);

    console.log(outputData);
  };
  reader.readAsText(file);
}

function createRandomWeight()
{
  return Math.random().toFixed(4);
}

function addEntry(name, weight)
{
  var entryElement =
  "<div class='col-sm-2'>" +
  "  <div class='text-center well well-sm form-group'>" +
  "    <h5 id='entry-node-name'>" + name + "</h5>" +
  "    <input id='entry-node-weight' style='width: 100%' type='number' name='' value='" + weight + "' hidden>"
  "  </div>" +
  "</div>";
  $("#entry-list").append(entryElement);
}

function addHiddenNode()
{
  var entryWeightElement = "";
  for( var i = 0; i < _allEntryList.getEntryNameList().length; i++ )
  {
    entryWeightElement +=
    "<form>" +
      "<div class='input-group'>" +
        "<span id='name' class='input-group-addon'>W(" + _allEntryList.getEntryNameList()[i] + ")</span>" +
        "<input id='weight' type='text' class='form-control' value='" + createRandomWeight() + "'>" +
      "</div>" +
    "</form>";
  }

  var hiddenNodeIndex = $("#hidden-layer-list").children().length + 1;

  var entryElement =
  "<div class='col-sm-3'>" +
  "  <div class='text-center well well-sm form-group weight-wrapper'>" +
  "    <div class='close-button-wrapper'>" +
  "      <button onclick='removeHiddenNode(this)' type='button' class='close' aria-label='Close'>" +
  "        <span aria-hidden='true'>&times;</span>" +
  "      </button>" +
  "    </div>" +
  "    <div id='hidden-weight-list'>" +
         entryWeightElement +
  "    </div>" +
  "    <label id='index'>" + hiddenNodeIndex + "</label>" +
  "  </div>" +
  "</div>";
  $("#hidden-layer-list").append(entryElement);

  addOutputWeight();
}

function addOutputWeight()
{
  $("#output-layer-list").html('');

  for( var k = 0; k < _allEntryList.getEntryNameList().length; k++ )
  {
    var hiddenElementList = $("#hidden-layer-list").children();
    var outputWeightElement = "";
    for( var i = 1; i <= hiddenElementList.length; i++ )
    {
      outputWeightElement +=
      "<form>" +
        "<div class='input-group'>" +
          "<span id='name' class='input-group-addon'>W(" + i + ")</span>" +
          "<input id='weight' type='text' class='form-control' value='" + createRandomWeight() + "'>" +
        "</div>" +
      "</form>";
    }

    var outputElement =
    "<div class='col-sm-3'>" +
    "  <div class='text-center well well-sm form-group'>" +
    "    <div id='output-weight-list'>" + outputWeightElement +
    "    </div>" +
    "    <h5 id='output-node-name'>" + k + "</h5>" +
    "    <input id='output-node-weight' style='width: 100%' type='number' name='' value=''>"
    "  </div>" +
    "</div>";
    $("#output-layer-list").append(outputElement);
  }
}

function addOutputNode(name)
{
  var outputElement =
  "<div class='col-sm-3'>" +
  "  <div class='text-center well well-sm form-group'>" +
  "    <div id='output-weight-list'></div>" +
  "    <h5 id='output-node-name'>" + name + "</h5>" +
  "    <input id='output-node-weight' style='width: 100%' type='number' name='' value=''>"
  "  </div>" +
  "</div>";
  $("#output-layer-list").append(outputElement);
}

function removeHiddenNode(element)
{
  element.parentNode.parentNode.parentNode.parentNode.removeChild(element.parentNode.parentNode.parentNode);

  var hiddenElementList = $("#hidden-layer-list").children();
  var hiddenNodeList = [];
  for( var i = 0; i < hiddenElementList.length; i++ )
  {
    var indexElement = $($(hiddenElementList[i]).find("#index"));
    indexElement.text(i+1);
  }
}

function parse(contents)
{
  var textLineList = contents.split(/\r\n|\n/);
  var headingList = textLineList[0].split(',');
  var headingLength = headingList.length;
  var classIndex = headingLength-1;

  var inputData = new InputData();
  var allEntryList = [];
  var classList = [];
  var amountAttributes = 0;
  for( var i = 1; i < textLineList.length; i++ )
  {
    var entryList = textLineList[i].split(',');
    var entryListLength = entryList.length;

    var entry = new Entry();
    entry.setClassName(entryList[classIndex]);
    for( var j = 0; j < entryList.length; j++ )
    {
      if( entryList[j] != undefined && entryList[j] != "" )
      {
        amountAttributes ++;
      }
    }
    entryList.splice(entryList.length-1,1);
    entry.setList(entryList);
    allEntryList.push(entry);

    var className = entryList[classIndex];
    if( className != null )
    {
      if( classList.length == 0 )
      {
        classList.push(className);
      }
      else
      {
        var found = false;
        for( var j = 0; j < classList.length; j++ )
        {
          if( classList[j] == className )
          {
            found = true;
          }
        }
        if( !found )
        {
          classList.push(className);
        }
      }
    }
  }
  inputData.setEntryList(allEntryList);
  headingList.splice(classIndex,1);
  inputData.setEntryNameList(headingList);
  inputData.setAmountAttributes(amountAttributes);
  inputData.setmountClasses(classList.length);

  return inputData;
}

// =====================================================================================================================
// GETTERS & SETTERS ===================================================================================================
// =====================================================================================================================

/*
 * - no parameters.
 * - return dictionary with the structure like '[{ name: nameValue1, weight: weightValue1 }, { name: nameValue2, weight: weightValue2 }, ...]'.
 *
 * This function return array of entry node. Each component has name and your weight.
 */
function getEntryNodeList()
{
  var entryNodeElementList = $("#entry-list").children();
  var entryNodeList = [];
  for( var i = 0; i < hiddelNodeElementList.length; i++ )
  {
    var entryNodeName = $(entryNodeElementList[i]).find('#entry-node-name').text();
    var entryNodeWeigth = $(entryNodeElementList[i]).find('#entry-node-weigth').val();
    entryNodeList.push(
    {
      name: entryNodeName,
      weight: entryNodeWeigth
    });
  }
  return entryNodeList;
}

/*
 * - no parameters.
 * - return dictionary with the structure like
 * [
 *  [ 1, 2, 3, 4],
 *  [ 1, 2, 3, 4],
 *  [ 1, 2, 3, 4]
 * ]
 *
 * This function return array of hidden node. Each component has name and your weight.
 */
function getHiddenNodeList()
{
  var hiddelElementList = $("#hidden-layer-list").children();
  var hiddenNodeList = [];
  for( var i = 0; i < hiddelElementList.length; i++ )
  {
    var hiddenElement = $(hiddelElementList[i]).find("#hidden-weight-list").children();
    var weightList = [];
    for( var j = 0; j < hiddenElement.length; j++ )
    {
      weightList.push($(hiddenElement[j]).find("#weight").val());
    }
    hiddenNodeList.push(weightList);
  }
  return hiddenNodeList;
}

/*
 * - no parameters.
 * - return dictionary with the structure like
 * - return dictionary with the structure like
 * [
 *  [ 1, 2, 3, 4],
 *  [ 1, 2, 3, 4],
 *  [ 1, 2, 3, 4]
 * ]
 *
 * This function return array of output node. Each component has name and your weight.
 */
function getOutputNodeList()
{
  var outputElementList = $("#output-layer-list").children();
  var outputNodeList = [];
  for( var i = 0; i < outputElementList.length; i++ )
  {
    var outputElement = $(outputElementList[i]).find("#output-weight-list").children();
    var weightList = [];
    for( var j = 0; j < outputElement.length; j++ )
    {
      weightList.push($(outputElement[j]).find("#weight").val());
    }
    outputNodeList.push(weightList);
  }
  return outputNodeList;
}

/*
 * - one parameter: boolean.
 * - no return value.
 *
 * This function set editable or not editable all the entry nodes available.
 * true: set editable.
 * false: set not editable.
 */
function setEntryListEditable(editable)
{
  var entryList = $('#entry-list').children();
  for( var i = 0; i < entryList.length; i++ )
  {
    $(entryList[i]).find('#entry-node-weight').removeAttr('hidden');
  }
}

/*
 * - no parameters.
 * - return boolean 'true' or 'false'.
 *
 * This function return true or false.
 * true: use logistic.
 * false: use hyperbolic tangent.
 */
function getFunctionType()
{
  var isLogisticFunctionType = $("#radio-logistic-input").is(':checked');
  return isLogisticFunctionType;
}
