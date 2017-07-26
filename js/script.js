document.getElementById('file-input').addEventListener('change', readFile, false);

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

    element = document.getElementById('file-configuration');
    element.textContent = "Amount of atributes: " + inputData.getAmountAttributes() + "\n" + "Amount of classes: " + inputData.getAmountClasses();

    element = document.getElementById('file-content');
    element.textContent = contents;

    for( var i = 0; i < inputData.getEntryNameList().length; i++ )
    {
      addEntry(inputData.getEntryNameList()[i], 0);
    }
  };
  reader.readAsText(file);
}

function addEntry(name, weight)
{
  var entryElement = "<div class='col-sm-3'><div class='text-center well well-sm form-group'><h5>" + name + "</h5><input style='width: 100%' type='number' name='' value='" + weight + "'></div></div>";
  $("#entry-list").append(entryElement);
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
